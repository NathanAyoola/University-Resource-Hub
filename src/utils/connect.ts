import mongoose from 'mongoose';
import  config from 'config';
import {logger} from './logger'

async function connect(){
    const dbUri = config.get<string>('dbUri');
  
    try {
        await mongoose.connect(dbUri)
        logger.info("db running")
    } catch (error) {
        logger.error('Unable to connect');
        logger.error([error]);
    }    
    
}

export default connect
