import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  timestamps: true,
  tableName: 'chat_messages',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
})
export class ChatMessagesTable extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true
  })
  declare channelId: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  declare serializedData: string;
}
