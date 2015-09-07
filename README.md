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
node build/src/eparser.js -i ./data/sample-2.txt  -t 'how many yards are there in a mile?'
node build/src/eparser.js -i ./data/sample-2.txt  -t 'Convert 12 million KiloMeters to LightYears.'
node build/src/eparser.js -i ./data/sample-2.txt  -t 'How much is 12 million kilometers in lightyears?'
node build/src/eparser.js -i ./data/sample-2.txt  -t 'Convert 20102 billion KiloMeters to LightYears.'
node build/src/eparser.js -i ./data/sample-2.txt  -t 'Convert 2 parsec to LightYears.'
node build/src/eparser.js -i ./data/sample-2.txt  -t 'What is a mile in meters?'
node build/src/eparser.js -i ./data/sample-2.txt  -t 'what is 10 thousand miles in kilometers?'
```
If you try something that the tool is unable to parse you can re-run with '-l' option that will ask it to learn the syntax. 
After the tool learns the syntax it is able to handle sentences that follow similar structure. 

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
The learning mode kick's in when there is an '-l' as argument and when an input is provided that does not match any of the predefined rule.
Hear is an example of interactive learning

```
node ./build/src/eparser.js -l -t 'How many Kilos are there in 30 Tons?'
Processing :: How many Kilos are there in 30 Tons ? 	ParsedMeaning[]
   This Statement did not match any of the types that I am able to recognize.
   Verb in this statement :: VerbBase:: {"verb":"are","rawVerbMod":"are>nmod:in>Tons>nummod>30","verbModWhat":"Tons>nummod>30","verbMod":"are>mod>How>dep>Kilos>mod>many","rawVerbAdvMod":"are>mod>How>dep>Kilos>mod>many"}
>> Do you want to learn this pattern (Yes/No)>yes
>> Select Node type (Default,Define,QConv,Relation,Units)? QConv
>> Processing [convTo] Select > Kilos
>> Processing [convFrom] Select > Tons
>> Processing [fromValue] Select > 30
LEARNED :::{"stmt":"How many Kilos are there in 30 Tons ?","match":{"verb":"/are/i","verbModWhat":"/([^>]+)>nummod>([^>]+)/i","verbMod":"/are>mod>How>dep>([^>]+)>mod>many/i"},"extract":{"convTo":"verbMod[1]","convFrom":"verbModWhat[1]","fromValue":"verbModWhat[2]"},"type":"QConv"}
```
alternatively you can use a single command line without any question/answers to learn a single line. (This is the mechanism 
used to create the first database as in ./data/training.sh)
```
>node ./build/src/eparser.js -l -t 'How many Kilos are there in 30 Tons?' -L 'yes,QConv,Kilos,Tons,30'
Processing :: How many Kilos are there in 30 Tons ? 	ParsedMeaning[]
   This Statement did not match any of the types that I am able to recognize.
   Verb in this statement :: VerbBase:: {"verb":"are","rawVerbMod":"are>nmod:in>Tons>nummod>30","verbModWhat":"Tons>nummod>30","verbMod":"are>mod>How>dep>Kilos>mod>many","rawVerbAdvMod":"are>mod>How>dep>Kilos>mod>many"}
>> Do you want to learn this pattern (Yes/No)>yes
>> Select Node type (Default,Define,QConv,Relation,Units)? QConv
Node:[QConv] Args Needed :["convTo","convFrom","fromValue"]
>> Processing [convTo] Select > Kilos
>> Processing [convFrom] Select > Tons
>> Processing [fromValue] Select > 30
LEARNED :::{"stmt":"How many Kilos are there in 30 Tons ?","match":{"verb":"/are/i","verbModWhat":"/([^>]+)>nummod>([^>]+)/i","verbMod":"/are>mod>How>dep>([^>]+)>mod>many/i"},"extract":{"convTo":"verbMod[1]","convFrom":"verbModWhat[1]","fromValue":"verbModWhat[2]"},"type":"QConv"}
Done
```
All learned rules are stored in a database ./lexp.db. It's a json formated text file so you can view/edit it. 


## Debugging 
The code uses debug module, so debuggin is enabled by setting the "DEBUG" variable 
>`DEBUG=eparser:gr*,eparser:exp,node:exp:qconv node build/src/eparser.js -i ./data/sample-2.txt`

If you want to check what tags are available to turn on for debug run the following command
>`egrep 'require\(.*\)\(.*\)|debug\(.*\)' -R src`



## Notes
---------
### Understanding what is being said :-
There is two parts to this, the first part is the NLP processing which extracts the grammar tokens and correlates the different words.
The second part is to extract the command and the arguments from the parsed data structure. 
The first part is being handled by coreNLP, there is some additional work to extract the verb and additional primitives out of it. 
The second part is implemented in form of a database of regular expressions. The data base is populated by learning when a new format 
is encountered.
It's my observation that there is more learning required if the first part is weak. As there is more intelligence in the first part the learning pressure reduces. 

TODO's: To improve the grammar parsing. Universal dependencies are not completely supported (Only select few are handled). 
The parsed data structure is flat (Of course it helps in doing regular expression scans on it) but it needs to be converted into 
dictionaries to make it hierarchical.
The pattern matching is not very smart, can be improved to be generic(Have to put more thoughts on it).

#### Problem Statement that is addressed in the first phase :
A mechanism that can take context-free natural language commands and translate it into a function call with arguments. 
this is what's being done by the code.

 

REGEX :-

tell me how many meters in a kilometer
tell me how many meters in 3 kilometers
This support is broken .... in verb node.
tell me how many meters in 3 thousand kilometers
