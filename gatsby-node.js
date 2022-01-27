const path = require('path');
const { google } = require('googleapis');

exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions;

  createPageRank();

  // `IPageRank` と `PageRank` を作成する
  function createPageRank() {
    createTypes(`
      interface IPageRank @nodeInterface {
        id: ID!
        path: String!
        title: String!
        count: Int!
      }
    `);

    createTypes(
      schema.buildObjectType({
        name: `PageRank`,
        fields: {
          id: { type: `ID!` },
          path: { type: `String!` },
          title: { type: `String!` },
          count: { type: `Int!` },
        },
        interfaces: [`Node`, `IPageRank`],
      })
    );
  }
};

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest, reporter }) => {
  const { createNode } = actions;

  // 配列の片方をキー、片方を値にしたオブジェクトを作成する
  const mapFromArray = (a1, a2) => {
    let valueMap = {};
    for (let i = 0, length = Math.min(a1.length, a2.length); i < length; i++) {
      let v1 = a1[i],
        v2 = a2[i];
      valueMap[v1] = v2;
    }

    return valueMap;
  };

  await addPageRankNodes();

  // `PageRank` のノードを追加する
  async function addPageRankNodes() {
    const scopes = 'https://www.googleapis.com/auth/analytics.readonly';

    // 認証に必要な情報を設定
    const jwt = new google.auth.JWT(process.env.GCP_CLIENT_EMAIL, null, process.env.GCP_PRIVATE_KEY.replace(/\\n/gm, '\n'), scopes);

    const analyticsreporting = google.analyticsreporting({
      version: 'v4',
      auth: jwt,
    });

    // 認証
    await jwt.authorize();

    // 下記で API にリクエストをかけてデータを取得する
    // ここでは以下の条件でデータを取得しています
    const res = await analyticsreporting.reports.batchGet({
      requestBody: {
        reportRequests: [
          {
            viewId: process.env.GCP_VIEW_ID,

            // 期間: 30 日前から当日まで
            dateRanges: [
              {
                startDate: '30daysAgo',
                endDate: 'today',
              },
            ],

            // ページパスとページタイトルを基準にする
            dimensions: [
              {
                name: 'ga:pagePath',
              },
              {
                name: 'ga:pageTitle',
              },
            ],

            // ページビュー数を指標にする
            metrics: [
              {
                expression: 'ga:pageviews',
              },
            ],

            // ページパスが `/information/` から始まるものに限定。
            filtersExpression: `ga:pagePath=~^/information/`,

            // 並び順: ページビュー数の降順
            orderBys: {
              fieldName: 'ga:pageviews',
              sortOrder: 'DESCENDING',
            },

            // 最大取得件数、PV数を各ページの詳細ページへ表示したいので今回は2000件にしておく
            pageSize: 1000,
          },
        ],
      },
    });

    // データが取得できない場合は終了させる
    if (res.statusText !== 'OK') {
      reporter.panic(`Reporting API response status is not OK.`);
      return;
    }

    const [report] = res.data.reports;
    const dimensions = report.columnHeader.dimensions;
    const rows = report.data.rows;

    console.log(rows);

    for (const row of rows) {
      let valueMap = mapFromArray(dimensions, row.dimensions);

      let data = {
        path: valueMap['ga:pagePath'],
        title: valueMap['ga:pageTitle'],
        count: parseInt(row.metrics[0].values[0], 10),
      };

      let nodeMeta = {
        id: createNodeId(`PageRank-${data.path}`),
        parent: null,
        children: [],
        internal: {
          type: `PageRank`,
          contentDigest: createContentDigest(data),
        },
      };

      let node = Object.assign({}, data, nodeMeta);

      if (valueMap['ga:pagePath'].slice(-1) === '/') {
        createNode(node);
      }
    }
  }
};
