# nlpUnitConverter
Unit conversion tool based on a natural language interface.

# To Setup
 npm install

# To Build
 grunt build

# To Test
 grunt test


# To test you can run
node build/src/eparser.js -i ./data/sample-1.txt

#Examples
  961  node build/src/eparser.js -i ./data/sample-2.txt  -t 'Convert 12 KiloMeters to LightYears.'
  962  node build/src/eparser.js -i ./data/sample-2.txt  -t 'Convert 12 KiloMeters to LightYears.'
  963  node build/src/eparser.js -i ./data/sample-2.txt  -t 'Convert 12 million KiloMeters to LightYears.'
  964  node build/src/eparser.js -i ./data/sample-2.txt  -t 'Convert 12 billion KiloMeters to LightYears.'
  965  node build/src/eparser.js -i ./data/sample-2.txt  -t 'Convert 20102 billion KiloMeters to LightYears.'
  966  node build/src/eparser.js -i ./data/sample-2.txt  -t 'Convert 2 parsec to LightYears.'
  967  node build/src/eparser.js -i ./data/sample-2.txt  -t 'Convert 2 Parsec to LightYears.'
  968  node build/src/eparser.js -i ./data/sample-2.txt  -t 'Convert 2 Parsec to Foot.'
  
# Notes
TIME is a type of MEASUREMENT.
by default TIME should be expressed in seconds or sec.
TIME can be expressed in minutes or min, one minute is sixty seconds.
another unit of TIME is hours or hrs, one hour is sixty minutes.
TIME can also be expressed in milisec or ms, one sec is 1000 milisec.
TIME can be in microsec or us, one milisec is 1000 micorsec.

time is also expressed in other units which are listed here
   > minutes or min ( *60 to convert to sec).
   > hours or hrs ( *60 to convert to min).
   > milisec or ms ( /1000 to convert to sec).
   > microsec or us ( /1000 to convert to sec).


---------------------------

Working on
The default unit for time is seconds.
other units for time are milliseconds, microseconds, year, day.
Time is expressed in hours, minutes, seconds.
There are 60 seconds in one minute.



--- Default
--- Units/Expressed
--- Conversion

-- Add TO VerbBase (Wh-Clauses)
 - Who
 - What
 - when
 - where
 - which
 - whose
 - why / how


 --- add test cases for nummod


---------
