import * as carrier from "carrier";
import * as morgan from "morgan";
import * as stream from "stream";
import { MongoClient, ObjectId } from "mongodb";
import { IRequest } from "../interfaces/request.interface";
// import { IRequest } from "@/core/interfaces/request.interface";

const PassThroughStream = stream.PassThrough;

export interface IMongoMorganOptions {
  collection?: string;
  stream?: stream.PassThrough;
}

export function mongoMorgan(
  format: string,
  mongodbUrl: string,
  dbName?: string,
  options?: IMongoMorganOptions
) {
  options = options || {};

  const buffer = [] as IRequest[];
  const collection = options?.collection || "Requests";

  // create stream for morgan to write to
  const stream = new PassThroughStream();

  // create stream to read from
  const lineStream = carrier.carry(stream);
  lineStream.on("line", onLine);

  // create mongo client
  let mongoCollection = null;
  MongoClient.connect(mongodbUrl, onConnect);

  // mixin options
  options.stream = stream;

  function onConnect(error, client: MongoClient) {
    if (error) {
      throw error;
    }

    const db = client.db(dbName);

    mongoCollection = db.collection(collection);
  }

  function parseLine(line: string): IRequest {
    // Remove all ANSI colors/styles from strings
    const parts = line
      .replace(
        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
        ""
      )
      .split(" ");

    let url = parts[1]?.split("?").shift();
    const url_parts = url
      ?.split("/")
      ?.map((e) => (ObjectId.isValid(e) ? ":id" : e));
    url = url_parts?.join("/");

    return {
      method: parts[0],
      url: parts[1]?.split("?").shift(),
      apiName: `${parts[0]} - ${parts[1]?.split("?").shift()}`,
      statusCode: Number(parts[2]),
      durationTime: Number(parts[3]),
      unit: parts[4],
    } as IRequest;
  }

  function onLine(line: string) {
    console.log(line);
    const parsedLine = parseLine(line);

    let entry = {
      createdAt: new Date(),
      ...parsedLine,
    } as IRequest;

    buffer.push(entry);

    try {
      if (!mongoCollection) {
        console.log("COLLECTION NOT CONNECTED");
        return;
      }

      while (buffer.length !== 0) {
        entry = buffer.shift();
        mongoCollection.insertOne(entry);
      }
    } catch (e) {
      console.warn("[ERROR] onLine in mongoMorgan", e);
    }
  }

  return morgan(format, options);
  // return morgan(format) // should use this
}
