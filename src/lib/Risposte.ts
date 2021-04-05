import Sequelize, {DataTypes, Model, Optional} from 'sequelize';

export interface RisposteAttributes {
    ID: number;
    risposte: string;
}

export type RispostePk = "ID";
export type RisposteId = Risposte[RispostePk];
export type RisposteCreationAttributes = Optional<RisposteAttributes, RispostePk>;

export default class Risposte extends Model<RisposteAttributes, RisposteCreationAttributes> implements RisposteAttributes {
    ID!: number;
    risposte!: string;


    static initModel(sequelize: Sequelize.Sequelize): typeof Risposte {
        Risposte.init({
            ID: {
                autoIncrement: true,
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true
            },
            risposte: {
                type: DataTypes.TEXT,
                allowNull: false
            }
        }, {
            sequelize,
            tableName: 'risposte',
            timestamps: false,
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        {name: "ID"},
                    ]
                }
            ]
        });
        return Risposte;
    }
}
