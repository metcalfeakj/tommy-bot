import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
  timestamps: true,
  tableName: "CassetteTape",
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
})
class CassetteTapeTable extends Model {

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare authorId: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare authorName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare serverId: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare serverName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare channelId: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare channelName: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare messageContent: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare messageDate: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  declare isBot: boolean;
}



@Table({
  timestamps: true,
  tableName: "ChannelConfigs",
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
})
class ChannelConfigsTable extends Model {

  @Column({
    type: DataType.STRING,
    allowNull: false,
    primaryKey: true,
  })
  declare channelId: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare persistentContent: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare persistentRole: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare totalMessageLength: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  declare sentient: boolean;
}


export { CassetteTapeTable, ChannelConfigsTable}