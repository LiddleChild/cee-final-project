require("dotenv").config();

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { PutCommand, DeleteCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ regions: process.env.AWS_REGION });

/*
  ==================== getTable ====================
 */
const getId = (event_id, user_id) => {
  return `${event_id}-${user_id}`;
};

/*
  ==================== getTable ====================
 */
exports.getTable = async () => {
  try {
    const params = {
      TableName: process.env.STATUS_TABLE_NAME,
    };

    const data = await client.send(new ScanCommand(params));
    return data.Items;
  } catch (err) {
    console.error(err);
    return undefined;
  }
};

/*
  ==================== addItem ====================
 */
exports.addItem = async (event_id, user_id, status) => {
  try {
    const params = {
      TableName: process.env.STATUS_TABLE_NAME,
      Item: {
        id: getId(event_id, user_id),
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
exports.deleteItem = async (event_id, user_id) => {
  try {
    const params = {
      TableName: process.env.STATUS_TABLE_NAME,
      Key: {
        id: getId(event_id, user_id),
      },
    };

    await client.send(new DeleteCommand(params));
    return JSON.stringify({ message: "deleted item successfully" });
  } catch (err) {
    return JSON.stringify({ message: err });
  }
};
