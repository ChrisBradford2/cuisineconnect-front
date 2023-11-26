import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import {
  Attributes,
  CreateOptions,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export default function (connection: Sequelize) {
  const salt =
    process.env.SALT ??
    (console.warn(
      'No salt provided in environment. Please consider setting an environment variable, eg. `export SALT=R4nd0M`.',
    ),
    'salt');

  const jwtSecret =
    process.env.JWT_SECRET ??
    (console.warn(
      'No JWT secret provided in environment. Please consider setting an environment variable, eg. `export JWT_SECRET=R4nd0M`.',
    ),
    'secret');

  class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<User>
  > {
    declare uuid: string;
    declare password: string;
    declare email: string;
    declare preferences: string | null;

    checkPassword(password: string) {
      const hashedPassword = crypto
        .createHmac('SHA-256', salt)
        .update(password)
        .digest()
        .toString('hex');
      return hashedPassword === this.password;
    }

    generateToken() {
      return jwt.sign({ uuid: this.uuid, email: this.email }, jwtSecret, {
        expiresIn: '1y',
      });
    }
  }

  User.init(
    {
      uuid: {
        type: DataTypes.UUID,
        unique: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
          isNotNull: function (value: string | null) {
            if (value === null) {
              throw new Error('Email cannot be null');
            }
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          min: 8,
          is: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?])/,
        },
      },
      preferences: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize: connection,
      tableName: 'users',
    },
  );

  async function encryptPassword(
    user: User,
    options: CreateOptions<Attributes<User>>,
  ) {
    if (!options.fields?.includes('password')) {
      return;
    }

    user.password = crypto
      .createHmac('sha256', salt)
      .update(user.password)
      .digest()
      .toString('hex');
  }

  User.addHook('beforeCreate', encryptPassword);
  User.addHook('beforeUpdate', encryptPassword);

  return User;
}
