require("dotenv").config();

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { PutCommand, DeleteCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ regions: process.env.AWS_REGION });

/*
  ==================== getTable ====================
 */
exports.getTable = async () => {
  try {
    const params = {
      TableName: process.env.STATUS_TABLE_NAME,
    };

    const responseData = await client.send(new ScanCommand(params));
    let items = {};

    for (let i of responseData.Items) {
      let { user_id, event_id, status } = i;

      if (!items[user_id]) items[user_id] = {};
      items[user_id][event_id] = status;
    }

    return items;
  } catch (err) {
    console.error(err);
    return undefined;
  }
};

/*
  ==================== addItem ====================
 */
exports.addItem = async (user_id, event_id, status) => {
  try {
    const params = {
      TableName: process.env.STATUS_TABLE_NAME,
      Item: {
        user_id,
        event_id,
        status,
      },
    };

    await client.send(new PutCommand(params));
    return JSON.stringify({ message: "added item successfully" });
  } catch (err) {
    return JSON.stringify({ message: err });
  }
};

/*
  ==================== deleteItem ====================
 */
exports.deleteItem = async (user_id, event_id) => {
  try {
    const params = {
      TableName: process.env.STATUS_TABLE_NAME,
      Key: {
        user_id,
        event_id,
      },
    };

    await client.send(new DeleteCommand(params));
    return JSON.stringify({ message: "deleted item successfully" });
  } catch (err) {
    return JSON.stringify({ message: err });
  }
};
