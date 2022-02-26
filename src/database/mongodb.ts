import { Component, MongoClient, Database, Collection } from "../../deps.ts";

@Component()
export class DBManagement {
    public async connect(): Promise<Database> {
        const client = new MongoClient();
        await client.connect("mongodb://127.0.0.1:27017");
        return client.database("muevete");
    }

    public getCollection(name: string, db: Database): Collection<any> {
        return db.collection<any>(name);
    }
}