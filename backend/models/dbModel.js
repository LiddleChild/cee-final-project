require("dotenv").config();

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { PutCommand, DeleteCommand, ScanCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

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
      let { user_id, event_id, event_status, custom_data } = i;

      if (!items[user_id]) items[user_id] = {};
      items[user_id][event_id] = {
        status: event_status,
        custom: JSON.parse(custom_data || "{}"),
      };
    }

    return items;
  } catch (err) {
    console.error(err);
    return {};
  }
};

/*
  ==================== addItem ====================
 */
exports.addItem = async (user_id, event_id, status, customData) => {
  try {
    const params = {
      TableName: process.env.STATUS_TABLE_NAME,
      Item: {
        user_id: String(user_id),
        event_id: String(event_id),
        event_status: String(status),
        custom_data: JSON.stringify(customData),
      },
    };

    await client.send(new PutCommand(params));
    return JSON.stringify({ message: "added item successfully" });
  } catch (err) {
    console.error(err);
    return JSON.stringify({ message: "failed to add item" });
  }
};

/*
  ==================== updateItem ====================
 */
exports.updateItem = async (user_id, event_id, status) => {
  try {
    const params = {
      TableName: process.env.STATUS_TABLE_NAME,
      Key: {
        user_id: String(user_id),
        event_id: String(event_id),
      },
      UpdateExpression: "SET event_status = :s",
      ExpressionAttributeValues: {
        ":s": status,
      },
    };

    await client.send(new UpdateCommand(params));
    return JSON.stringify({ message: "updated item successfully" });
  } catch (err) {
    console.error(err);
    return JSON.stringify({ message: "failed to update item" });
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
        user_id: String(user_id),
        event_id: String(event_id),
      },
    };

    await client.send(new DeleteCommand(params));
    return JSON.stringify({ message: "deleted item successfully" });
  } catch (err) {
    console.error(err);
    return JSON.stringify({ message: "failed to delete item" });
  }
};
