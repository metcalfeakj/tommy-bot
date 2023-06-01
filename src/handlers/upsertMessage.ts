import { Optional } from 'sequelize/types';
import { Sequelize } from 'sequelize-typescript';

export const upsertMessage = async (database: Sequelize, record: Optional<any, string> | undefined): Promise<void> => {
    try {
        const newRecord = database.models.MessageTable.build(record);
        await newRecord.save();
    }
    catch (e) {
        console.log('Error - failed to save message to database.', e);
        throw e;
    }
}
