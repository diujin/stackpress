//stackpress
import type Request from '@stackpress/ingest/Request';
import type Response from '@stackpress/ingest/Response';
import type Server from '@stackpress/ingest/Server';
//schema
import type Model from '../../schema/spec/Model';
//sql
import type { DatabasePlugin } from '../types';
//actions
import search from '../actions/search';

/**
 * This is a factory function that creates an event 
 * handler for searching records in the database
 * 
 * Usage:
 * emitter.on('profile-search', searchEventFactory(profile));
 */
export default function searchEventFactory(model: Model) {
  return async function SearchEventAction(
    req: Request, 
    res: Response,
    ctx: Server
  ) {
    //if there is a response body or there is an error code
    if (res.body || (res.code && res.code !== 200)) {
      //let the response pass through
      return;
    }
    //get the database engine
    const engine = ctx.plugin<DatabasePlugin>('database');
    if (!engine) return;
    const response = await search(model, engine, req.data());
    res.fromStatusResponse(response);
  };
};