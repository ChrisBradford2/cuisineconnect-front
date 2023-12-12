import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export default function (connection: Sequelize) {
  class Recipe extends Model<
    InferAttributes<Recipe>,
    InferCreationAttributes<Recipe>
  > {
    declare content: string;
    declare title: string;
    declare id: number;
  }

  Recipe.init(
    {
      content: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: false,
      },
      id: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      sequelize: connection,
      tableName: 'recipes',
    },
  );

  return Recipe;
}
