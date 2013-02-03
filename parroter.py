#!/usr/bin/env python

import json
import os

def addQuote(quote, author, link):
	if not os.path.exists('./parrot.json'):
		with open('./parrot.json', 'wb') as jsonfile:
			json.dump({}, jsonfile)

	with open('./parrot.json') as parrot:
		quotes = json.load(parrot)

	if quotes:
		if author in quotes.keys():
			quotes[author][0].append(quote)
	
			if not quotes[author][1]:
				quotes[author][1] = link

		else:
			quotes[author] = [[quote], link]

	else:
		quotes = {author: [[quote], link]}
	
	with open('./parrot.json', 'w') as parrot:
		json.dump(quotes, parrot)

if __name__ == "__main__":
	quote = str(raw_input("Quote: "))
	author = str(raw_input("Author: "))
	link = str(raw_input("Link: "))

	addQuote(quote, author, link)
