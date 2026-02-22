import { itemsIndexKey, itemsKey } from "$services/keys";
import { SchemaFieldTypes } from "redis";
import { client } from "./client";

export const createIndexes = async () => {
	const indexes = await client.ft._list();

	const exists = indexes.find(index => index === itemsIndexKey());
	if (exists) {
		return;
	}

	return client.ft.create(
		itemsIndexKey(),
		{
			name: {
				type: SchemaFieldTypes.TEXT,
				SORTABLE: true
			},
			description: {
				type: SchemaFieldTypes.TEXT,
				SORTABLE: false
			},
			ownerId: {
				type: SchemaFieldTypes.TAG,
				SORTABLE: false
			},
			endingAt: {
				type: SchemaFieldTypes.NUMERIC,
				SOTRABLE: true
			},
			bids: {
				type: SchemaFieldTypes.NUMERIC,
				SOTRABLE: true
			},
			views: {
				type: SchemaFieldTypes.NUMERIC,
				SOTRABLE: true
			},
			price: {
				type: SchemaFieldTypes.NUMERIC,
				SOTRABLE: true
			},
			likes: {
				type: SchemaFieldTypes.NUMERIC,
				SOTRABLE: true
			}
		} as any,
		{
			ON: "HASH",
			PREFIX: itemsKey("")
		}
	)
};
