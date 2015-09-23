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


TODO's: 

New :
* To allow multiple rules to match. 
* To have a better checkValid implementation that is able to understand if the statement is a fit.
  For example in case of measure grammar : it's only valid if Measure is mentioned.
  
 * Remove when, who, what etc... from nmod.js
 * Break each leg of the verb into seperate recognition type. 
    so combination of patterns are handled better.
    
    
    VBP(convert) (dobj, nmod:into)
    VB (convert) (dobj, nmod:to)
    VB(translate)(dobj, nmod:to)
    VBZ(is)      (nsubj->nmod:in)(dep)
    VBP(are)     (nmod:in, advmod)
    VBP(are)     (nmod:in, nsubj)
    VBP(are)     (nmod:in, nsubj)
    VB(tell)     (nmod:in<-dep)(dobj)
    ----- COP -----
    VB(are)      (cop->nsubj)
    VBZ(is)      (nsubj->nmod:in)



 - Add nodes for Arguments 
 - Add ability to build exp-nodes on exp-nodes.
 - add ability to force learn even if a grammer is matching
 - add grammar on top of grammar.
 
 