#!/usr/bin/env bash
set -x
#trap read debug


# node type : Unit
# Node:[Units] Args Needed :["unitsFor","units"]
node ./build/src/eparser.js -l -t 'Foo is a Unit for Bar.' -L 'yes,Units,Bar,Foo'
node ./build/src/eparser.js -l -t 'Units for Length are Meters, CentiMeters and League.' -L 'yes,Units,Length,CentiMeters League Meters'
node ./build/src/eparser.js -l -t 'unit for zLength is Meters, Lines, Inches and Yards.' -L 'yes,Units,zLength,Lines Inches Yards Meters'
node ./build/src/eparser.js -l -t 'Unit for measuring zTime is Minutes, Hours.' -L 'yes,Units,zTime,Hours Minutes'

# node type : QConv (Question on covnersion)
# Node:[QConv] Args Needed :["convTo","convFrom","fromValue"]
node ./build/src/eparser.js -l -t 'How many Kilos are there in 30 Tons?' -L 'yes,QConv,Kilos,Tons'
node ./build/src/eparser.js -l -t 'convert a meter into yards.' -L 'yes,QConv,yards,meter'
node ./build/src/eparser.js -l -t 'How many Foot are in a Mile?' -L 'yes,QConv,Foot,Mile'
node ./build/src/eparser.js -l -t 'Convert 60 Miles to foot.' -L 'yes,QConv,foot,Miles'
node ./build/src/eparser.js -l -t 'How much is two yards in foot?' -L 'yes,QConv,foot,yards'
node ./build/src/eparser.js -l -t 'How many Meters are there in two Parsec?' -L 'yes,QConv,Meters,Parsec'
node ./build/src/eparser.js -l -t 'How many meters are there in 5000 foot?' -L 'yes,QConv,meters,foot'
node ./build/src/eparser.js -l -t 'translate 10 thousand Parsec to Yards.' -L 'yes,QConv,Yards,Parsec'
node ./build/src/eparser.js -l -t 'what is a parsec in lightyears?' -L 'yes,QConv,lightyears,parsec'
node ./build/src/eparser.js -l -t 'tell me how many meters in a kilometer?' -L 'yes,QConv,kilometer,meters'
node ./build/src/eparser.js -l -t 'tell me how many meters in 3 kilometer?' -L 'yes,QConv,kilometer,meters'
# node type : Relation (Relations ship between units)
# [Relation] Args Needed :["nodeFrom","nodeTo","convN", "convD"]
node ./build/src/eparser.js -l -t 'There are 100 cents in a dollar.' -L 'yes,Relation,cents,dollar'
node ./build/src/eparser.js -l -t 'There is 2 foo in Five bar.' -L 'yes,Relation,foo,bar'
node ./build/src/eparser.js -l -t 'Twenty Moo equals 40 Boo.' -L 'yes,Relation,Moo,Boo'
node ./build/src/eparser.js -l -t 'Twenty Moo is equal to 4 hundred Boo.' -L 'yes,Relation,Moo,Boo'
node ./build/src/eparser.js -l -t 'twenty thousand Moo makes 4000 Boo.' -L 'yes,Relation,Moo,Boo'
node ./build/src/eparser.js -l -t '4 quarters is one Dollar.' -L 'yes,Relation,quarters,Dollar'
node ./build/src/eparser.js -l -t '4 quarters is equal to one Dollar.' -L 'yes,Relation,quarters,Dollar'
# node type : Define
#Node:[Define] Args Needed :["subj","type"]
node ./build/src/eparser.js -l -t 'Samay is defined as a Measure.' -L 'yes,Define,Samay,Measure'
node ./build/src/eparser.js -l -t 'Samay is defined to be a Measure.' -L 'yes,Define,Samay,Measure'
node ./build/src/eparser.js -l -t 'Samay is defined to be a type of Measure.' -L 'yes,Define,Samay,Measure'
node ./build/src/eparser.js -l -t 'Samay is a type of Measure.' -L 'yes,Define,Samay,Measure'
node ./build/src/eparser.js -l -t 'Samay is of type Measure.' -L 'yes,Define,Samay,Measure'
# node type : Default
# Node:[Default] Args Needed :["defaultWhat","defaultFor","default"]
node ./build/src/eparser.js -l -t 'By default time is expressed in minutes.' -L 'yes,Default,unit,time,minutes'
node ./build/src/eparser.js -l -t 'By default time is specified in minutes.' -L 'yes,Default,unit,time,minutes'
node ./build/src/eparser.js -l -t 'By default time is in minutes.' -L 'yes,Default,unit,time,minutes'
node ./build/src/eparser.js -l -t 'The default state of water is liquid.' -L 'yes,Default,state,water,liquid'
node ./build/src/eparser.js -l -i ./data/sample-2.txt -t 'The default unit for Length is meters.' -L 'yes,Default,unit,Length,meters'
