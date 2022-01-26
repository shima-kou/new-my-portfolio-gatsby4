const path = require('path');
const { google } = require('googleapis');

exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions;

  createPupularPage();

  // `IPopularPage` と `PopularPage` を作成する
  function createPupularPage() {
    createTypes(`
      interface IPopularPage @nodeInterface {
        id: ID!
        path: String!
        title: String!
        count: Int!
      }
    `);

    createTypes(
      schema.buildObjectType({
        name: `PopularPage`,
        fields: {
          id: { type: `ID!` },
          path: { type: `String!` },
          title: { type: `String!` },
          count: { type: `Int!` },
        },
        interfaces: [`Node`, `IPopularPage`],
      })
    );
  }
};

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest, reporter }) => {
  const { createNode } = actions;

  const mapFromArray = (a1, a2) => {
    let valueMap = {};
    for (let i = 0, length = Math.min(a1.length, a2.length); i < length; i++) {
      let v1 = a1[i],
        v2 = a2[i];
      valueMap[v1] = v2;
    }

    return valueMap;
  };

  await addPopularPageNodes();

  // `PopularPage` のノードを追加する
  async function addPopularPageNodes() {
    const scopes = 'https://www.googleapis.com/auth/analytics.readonly';

    const jwt = new google.auth.JWT(process.env.GCP_CLIENT_EMAIL, null, process.env.GCP_PRIVATE_KEY.replace(/\\n/gm, '\n'), scopes);

    const analyticsreporting = google.analyticsreporting({
      version: 'v4',
      auth: jwt,
    });
    await jwt.authorize();

    // 実際に API にリクエストをかけてデータを取得する
    // ここでは以下の条件でデータを取得しています
    // 期間: 30 日前から当日まで
    // ディメンション: ページパスとページタイトル
    // 指標: セッション数
    // 絞り込み: ページパスが `/content/` から始まるものに限定
    // 並び順: セッション数の降順
    // データ取得数: 20 件
    const res = await analyticsreporting.reports.batchGet({
      requestBody: {
        reportRequests: [
          {
            viewId: process.env.GCP_VIEW_ID,
            dateRanges: [
              {
                startDate: '30daysAgo',
                endDate: 'today',
              },
            ],
            dimensions: [
              {
                name: 'ga:pagePath',
              },
              {
                name: 'ga:pageTitle',
              },
            ],
            metrics: [
              {
                expression: 'ga:sessions',
              },
            ],
          },
        ],
      },
    });

    // データが取得できなければ終了
    if (res.statusText !== 'OK') {
      reporter.panic(`Reporting API response status is not OK.`);
      return;
    }

    // レスポンスからデータを抽出して node として保存する
    const [report] = res.data.reports;
    const dimensions = report.columnHeader.dimensions;
    const rows = report.data.rows;

    for (const row of rows) {
      let valueMap = mapFromArray(dimensions, row.dimensions);

      let data = {
        path: valueMap['ga:pagePath'],
        title: valueMap['ga:pageTitle'],
        count: parseInt(row.metrics[0].values[0], 10),
      };

      let nodeMeta = {
        id: createNodeId(`PopularPage-${data.path}`),
        parent: null,
        children: [],
        internal: {
          type: `PopularPage`,
          contentDigest: createContentDigest(data),
        },
      };

      let node = Object.assign({}, data, nodeMeta);

      console.log(node);

      createNode(node);
    }
  }
};
