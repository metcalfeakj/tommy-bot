import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
  timestamps: true,
  tableName: "cassette_tape",
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
}


export { CassetteTapeTable}