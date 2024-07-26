import { MongoClient, ServerApiVersion } from 'mongodb'

async function connect() {
  const client = new MongoClient(process.env.DB_CONNECTION_STRING, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  return client
}
export default connect