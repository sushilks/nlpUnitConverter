#!/usr/bin/env bash
set -x
EPARSER=./build/eparser.js
#trap read debug

# node type : Unit
# Node:[Units] Args Needed :["unitsFor","units"]
node $EPARSER -l -t 'Foo is a Unit for Bar.' -L 'yes,Units,Bar,Foo'
node $EPARSER -l -t 'Units for Length are Meters, CentiMeters and League.' -L 'yes,Units,Length,CentiMeters League Meters'
node $EPARSER -l -t 'unit for zLength is Meters, Lines, Inches and Yards.' -L 'yes,Units,zLength,Lines Inches Yards Meters'
node $EPARSER -l -t 'Unit for measuring zTime is Minutes, Hours.' -L 'yes,Units,zTime,Hours Minutes'


# node type : Define
#Node:[Define] Args Needed :["subj","type"]
node $EPARSER -l -t 'Samay is defined as a Measure.' -L 'yes,Define,Samay,Measure'
node $EPARSER -l -t 'Samay is defined to be a Measure.' -L 'yes,Define,Samay,Measure'
node $EPARSER -l -t 'Samay is defined to be a type of Measure.' -L 'yes,Define,Samay,Measure'
node $EPARSER -l -t 'Samay is a type of Measure.' -L 'yes,Define,Samay,Measure'
node $EPARSER -l -t 'Samay is of type Measure.' -L 'yes,Define,Samay,Measure'



# node type : QConv (Question on covnersion)
# Node:[QConv] Args Needed :["convTo","convFrom","fromValue"]
node $EPARSER -l -t 'How many Kilos are there in 30 Tons?' -L 'yes,QConv,Kilos,Tons,30'
node $EPARSER -l -t 'convert a meter into yards.' -L 'yes,QConv,yards,meter,1'
node $EPARSER -l -t 'How many Foot are in a Mile?' -L 'yes,QConv,Foot,Mile,1'
node $EPARSER -l -t 'Convert 60 Miles to foot.' -L 'yes,QConv,foot,Miles,60'
node $EPARSER -l -t 'How much is two yards in foot?' -L 'yes,QConv,foot,yards,two'
node $EPARSER -l -t 'How many Meters are there in two Parsec?' -L 'yes,QConv,Meters,Parsec,two'
node $EPARSER -l -t 'How many meters are there in 5000 foot?' -L 'yes,QConv,meters,foot,5000'
node $EPARSER -l -t 'translate 10 thousand Parsec to Yards.' -L 'yes,QConv,Yards,Parsec,10 thousand'
node $EPARSER -l -t 'what is a parsec in lightyears?' -L 'yes,QConv,lightyears,parsec,1'
node $EPARSER -l -t 'tell me how many meters in a kilometer?' -L 'yes,QConv,kilometer,meters,1'
node $EPARSER -l -t 'tell me how many meters in 3 kilometer?' -L 'yes,QConv,kilometer,meters,3'
node $EPARSER -l -t 'how many meters make 3 kilometer?' -L 'yes,QConv,kilometer,meters,3'
node $EPARSER -l -t 'how many meters make a kilometer?' -L 'yes,QConv,kilometer,meters,1'
node $EPARSER -l -t 'how many meters makes 3 kilometer?' -L 'yes,QConv,kilometer,meters,3'
node $EPARSER -l -t 'how many meters makes a kilometer?' -L 'yes,QConv,kilometer,meters,1'

##node $EPARSER -l -t 'what is 10 parsec in lightyears?' -L 'yes,QConv,lightyears,parsec,10'
## node $EPARSER -l -t 'Convert 60 Yards into meters.' -L 'yes,QConv,meters,Yards,60'
## node $EPARSER -l -t 'how many fathoms are there in a centimeters?' -L 'yes,QConv,fathoms,centimeters,1'
#node $EPARSER -l -t 'How many meters in 60 miles?' -L 'yes,QConv,meters,miles,60'
##node $EPARSER -l -t 'how many parsec are there in a foot?' -L 'yes,QConv,parsec,foot,1'
##node $EPARSER -l -t 'how many yards are there in a mile?' -L 'yes,QConv,yards,mile,1'


# Learn the arguments
node $EPARSER -l -t 'There are 100 cents in one dollar.'  -L 'yes,fromArg,cents'
node $EPARSER -l -t 'There are 100 cents in one dollar.'  -L 'yes,toArg,dollar'

node $EPARSER -l -t 'How many Kilos are there in 30 Tons?' -L 'yes,fromArg,Tons'
node $EPARSER -l -t 'How many Kilos are there in 30 Tons?' -L 'yes,toArg,Kilos'

node $EPARSER -l -t 'twenty thousand moo makes 4000 boo.' -L 'yes,toArg,boo'
node $EPARSER -l -t 'twenty thousand moo makes 4000 boo.' -L 'yes,fromArg,moo'
node $EPARSER -l -t '4 quarters is equal to one dollar.' -L 'yes,toArg,dollar'
node $EPARSER -l -t '4 quarters is equal to one dollar.' -L 'yes,fromArg,quarters'
node $EPARSER -l -t '4 quarters is same as one dollar.' -L 'yes,toArg,dollar'
node $EPARSER -l -t '4 quarters is same as one dollar.' -L 'yes,fromArg,quarters'

##
node $EPARSER -l -t 'One foot is 12 inch .'  -L 'yes,toArg,Inch'
##
node $EPARSER -l -t 'One foot is 12 inch .'  -L 'yes,fromArg,Foot'
node $EPARSER -l -t '4 quarters is one Dollar.'  -L 'yes,fromArg,quarters'


node $EPARSER -l -t 'Twenty Moo equals 40 Boo.' -L 'yes,toArg,Boo'
node $EPARSER -l -t 'Twenty Moo equals 40 Boo.' -L 'yes,fromArg,Moo'

node $EPARSER -l -t 'There is 2 foo in Five bar.' -L 'yes,fromArg,foo'
node $EPARSER -l -t 'One inch is same as 2.54 cm.'  -L 'yes,toArg,cm'

# node type : Relation (Relations ship between units)
# [Relation] Args Needed :["nodeFrom","nodeTo","convN", "convD"]
#node $EPARSER -l -t '' -L 'yes,Relation,'
node $EPARSER -i ./data/sample-training.txt -l -t 'There are 100 cents in a dollar.' -L 'yes,Relation,cents,dollar,100,1'
node $EPARSER -i ./data/sample-training.txt -l -t 'There is 2 foo in Five bar.' -L 'yes,Relation,foo,bar,2,Five'
node $EPARSER -i ./data/sample-training.txt -l -t 'Twenty Moo equals 40 Boo.' -L 'yes,Relation,Moo,Boo,Twenty,40'
node $EPARSER -i ./data/sample-training.txt -l -t 'Twenty moo is equal to 4 hundred boo.' -L 'yes,Relation,moo,boo,Twenty,4 hundred'
node $EPARSER -i ./data/sample-training.txt -l -t 'twenty thousand Moo makes 4000 Boo.' -L 'yes,Relation,Moo,Boo,twenty thousand,4000'
## node $EPARSER -l -t 'Four quarters makes a Dollar.' -L 'yes,Relation,quarters,Dollar,Four,1'
node $EPARSER -l -t '4 quarters is one Dollar.' -L 'yes,Relation,quarters,Dollar,4,one'
#node $EPARSER -l -t '4 quarters is equal to one Dollar.' -L 'yes,Relation,quarters,Dollar,4,one'
node $EPARSER -i ./data/sample-training.txt -l -t 'One inch is same as 2.54 cm.'  -L 'yes,Relation'
node $EPARSER -l -t '4 quarters is equal to one Dollar.' -L 'yes,relation'
node $EPARSER -l -t 'One Dollar is equal to four quarters.' -L 'yes,relation'


#One fathom is equal to 2 yards .
#One rod is equal to 5 meters .
#
#
# node type : Default
# Node:[Default] Args Needed :["defaultWhat","defaultFor","default"]
node $EPARSER -l -t 'By default time is expressed in minutes.' -L 'yes,Default,unit,time,minutes'
node $EPARSER -l -t 'By default time is specified in minutes.' -L 'yes,Default,unit,time,minutes'
node $EPARSER -l -t 'By default time is in minutes.' -L 'yes,Default,unit,time,minutes'
node $EPARSER -l -t 'The default state of water is liquid.' -L 'yes,Default,state,water,liquid'
node $EPARSER -l -t 'The default unit for Length is Meters.' -L 'yes,Default,unit,Length,Meters'
#node $EPARSER -l -t 'The default status of men is to be lazy.' -L 'yes,Default,status,men,lazy'
