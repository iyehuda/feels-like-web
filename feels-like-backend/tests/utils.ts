import { MongoMemoryServer } from "mongodb-memory-server";

export type AuthResponse = { userId: string; accessToken: string; refreshToken: string };
export type Teardown = () => Promise<void>;

export interface DBConfig {
  dbConnectionString: string;
  closeDatabase: Teardown;
}

export async function createDatabase(): Promise<DBConfig> {
  const mongoServer = await MongoMemoryServer.create();
  console.log(`MongoDB URI: ${mongoServer.getUri()}`);

  return {
    closeDatabase: async () => {
      await mongoServer.stop();
    },
    dbConnectionString: mongoServer.getUri(),
  };
}

export const invalidId = "1234";
export const nonExistentId = "999999999999999999999999";
