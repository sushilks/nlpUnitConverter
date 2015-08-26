# nlpUnitConverter
Unit conversion tool based on a natural language interface.
This is a work in progress, I have tried multiple approaches so the code may have some crud. 
Some of the problems are still unsolved. 

The basic idea is to be able to provide statements to the program that define the different units and relationship
between them. This data is provided in natural language and in english.
The Program is going to parse all the data and create a graph that stores the information. 
After that if a question is asked about any type of conversion it's able to traverse the graph and provide the right converstion.

I am using this to investigate if it's possible to accept input from use in plain english and match it to grammar rules that translate it into specific instructions. 

## To Setup

 npm install

 Stanford NLP Core libraries need to be installed. [LINK](http://nlp.stanford.edu/software/stanford-corenlp-full-2015-04-20.zip)

 Soft link the directory where you install the stanford core nlp to the base directory here
 
 `ln -s ~/homework/stanford-corenlp-full-2015-04-20 corenlp`
 
 Make sure the config in src/corenlp_server.js are correct for corenlp
 
 you can test out if everything is fine by running
  
 `grunt run-server`
 
 bunch of output on the screen with last line as "Server is listening at 8990"
 
## To Build

`grunt build`

## To Test

`grunt server-start`

`grunt test`

`grunt server-stop`


## Some Sample 

There is a set of predefined instructions in src/sample-2.txt
You can use that to seed the system and then ask it specific question about conversion.
Here are some examples that can be used as query

```
node build/src/eparser.js -i ./data/sample-2.txt  -t 'Convert 12 KiloMeters to LightYears.'
node build/src/eparser.js -i ./data/sample-2.txt  -t 'Convert 12 KiloMeters to LightYears.'
node build/src/eparser.js -i ./data/sample-2.txt  -t 'Convert 12 million KiloMeters to LightYears.'
node build/src/eparser.js -i ./data/sample-2.txt  -t 'Convert 12 billion KiloMeters to LightYears.'
node build/src/eparser.js -i ./data/sample-2.txt  -t 'Convert 20102 billion KiloMeters to LightYears.'
node build/src/eparser.js -i ./data/sample-2.txt  -t 'Convert 2 parsec to LightYears.'
node build/src/eparser.js -i ./data/sample-2.txt  -t 'Convert 2 Parsec to LightYears.'
node build/src/eparser.js -i ./data/sample-2.txt  -t 'Convert 2 Parsec to Foot.'
```

## Notes
---------
add suport for --

// How much is 10 Foot in Inch?

// tell me how many Inch are there in 10 Foot
