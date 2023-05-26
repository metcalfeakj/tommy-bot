import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
  timestamps: true,
  tableName: "messages",
})

class MessageTable extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare server_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare server_channel: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare author: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare message: string;
}


@Table({
  timestamps: true,
  tableName: "cassette_tape",
})
class CassetteTapeTable extends Model {

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  declare id: number;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  declare chat_history: JSON;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare summary: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare model: string;

}


export { MessageTable,  CassetteTapeTable}