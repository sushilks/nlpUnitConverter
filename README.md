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
## Using the CLI
```
node build/src/eparser.js -i ./data/sample-2.txt  -c
Processing: ....Processing: ....Processing: ....
>convert 2.5 Meters into Foot.
Processing :: convert 2.5 Meters into Foot . 	ParsedMeaning[QConv ]
		QConv::Converted 2.5 meter to foot Value = 0.8202099737532806
```
In the example above the command runs and stops at a prompt '>' there after I entered a query "convert 2.5 Meters into Foot."

The CLI allows for interacting the converter and for adding new unit's to the converter. 

press 'Ctrl-D' to exit the CLI

It's possible to enable debug while in CLI by running the following commands (This is work in progress and not working right now. 
Primarily becase the debug objects are disconnected and the eparser module is unable to reach the other debug modules to set the config).

`>enable debug .*`
or
`>enable debug eparser:.*` 


## Learning Mode
```
node ./build/src/eparser.js -i ./data/sample-2.txt -c -l
>translate 5 million kilometers into fathom.
Processing :: translate 5 million kilometers into fathom . 	ParsedMeaning[]
   This Statement did not match any of the types that I am able to recognize.
   Verb in this statement :: VerbBase:: {"verb":"translate","rawVerbMod":"translate>nmod:into>fathom","verbModWhat":"fathom","verbMod":"translate","rawObj":"kilometers>nummod>5 million","obj":"kilometers>nummod>5 million"}
>> Do you want to learn this pattern (Yes/No)>yes
>> Select Node type (Default,Define,QConv,Relation,Units)? QConv
>> Processing [verb] Regexp >/translate/
>> Processing [verbModWhat] Regexp >/(.*)/
>> Processing [verbMod] Regexp >/translate/
>> Processing [obj] Regexp >/([^>]+)>nummod>([^>]+)/
>> Processing [convTo] Select > verbModWhat[1]
>> Processing [convFrom] Select > obj[1]
>> Processing [fromValue] Select > obj[2]
Learned :: {"stmt":"translate 5 million kilometers into fathom .","match":{"verb":"/translate/","verbModWhat":"/(.*)/","verbMod":"/translate/","obj":"/([^>]+)>nummod>([^>]+)/"},"extract":{"convTo":"verbModWhat[1]","convFrom":"obj[1]","fromValue":"obj[2]"},"type":"QConv"}
>translate 5 million kilometers into fathom.
Processing :: translate 5 million kilometers into fathom . 	ParsedMeaning[QConv ]
		QConv::Converted 5 million kilometer to fathom Value = 2734033245.844269
```

## Debugging 
The code uses debug module, so debuggin is enabled by setting the "DEBUG" variable 
>`DEBUG=eparser:gr*,eparser:exp,node:exp:qconv node build/src/eparser.js -i ./data/sample-2.txt`

If you want to check what tags are available to turn on for debug run the following command
>`egrep 'require\(.*\)\(.*\)|debug\(.*\)' -R src`



## Notes
---------
add support for --
 Testing the DB, 
 Populating the DB from scripts.
 

REGEX :-
.: a single character.
\s: a whitespace character (space, tab, newline).
\S: non-whitespace character.
\d: a digit (0-9).
\D: a non-digit.
\w: a word character (a-z, A-Z, 0-9, _).
\W: a non-word character.
[\b]: a literal backspace (spec