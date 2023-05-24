import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
  timestamps: true,
  tableName: "messages",
})
export class MessageTable extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  server_name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  server_channel!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  author!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  message!: string;
}