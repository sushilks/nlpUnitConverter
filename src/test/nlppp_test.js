'use strict';
/*global describe: true, before: true, it: true*/


import NLPPP from '../nlp_pp.js';
var assert = require('assert');

describe('NLPPP Test::', function() {

    let pp1, pp2;

    before(()=>{
/* eslint-disable */
        var txt1 = {"body":"{\"document\":{\"sentences\":{\"sentence\":{\"$\":{\"id\": \
                    \"1\"},\"tokens\":{\"token\":[{\"$\":{\"id\":\"1\"},\"word\":\"TIME\",\"lemma\":\"time\",\"CharacterOffsetBegin\":\"0\", \
                    \"CharacterOffsetEnd\":\"4\",\"POS\":\"NN\",\"NER\":\"O\",\"Speaker\":\"PER0\"},{\"$\":{\"id\":\"2\"},\"word\":\"is\", \
                    \"lemma\":\"be\",\"CharacterOffsetBegin\":\"5\",\"CharacterOffsetEnd\":\"7\",\"POS\":\"VBZ\",\"NER\":\"O\",\"Speaker\":\"PER0\"}, \
                    {\"$\":{\"id\":\"3\"},\"word\":\"defined\",\"lemma\":\"define\",\"CharacterOffsetBegin\":\"9\",\"CharacterOffsetEnd\":\"16\", \
                    \"POS\":\"VBN\",\"NER\":\"O\",\"Speaker\":\"PER0\"},{\"$\":{\"id\":\"4\"},\"word\":\"to\",\"lemma\":\"to\",\"CharacterOffsetBegin\":\"17\", \
                    \"CharacterOffsetEnd\":\"19\",\"POS\":\"TO\",\"NER\":\"O\",\"Speaker\":\"PER0\"},{\"$\":{\"id\":\"5\"},\"word\":\"be\",\"lemma\":\"be\", \
                    \"CharacterOffsetBegin\":\"20\",\"CharacterOffsetEnd\":\"22\",\"POS\":\"VB\",\"NER\":\"O\",\"Speaker\":\"PER0\"},{\"$\":{\"id\":\"6\"}, \
                    \"word\":\"a\",\"lemma\":\"a\",\"CharacterOffsetBegin\":\"23\",\"CharacterOffsetEnd\":\"24\",\"POS\":\"DT\",\"NER\":\"O\",\"Speaker\":\"PER0\"}, \
                    {\"$\":{\"id\":\"7\"},\"word\":\"Measure\",\"lemma\":\"measure\",\"CharacterOffsetBegin\":\"26\",\"CharacterOffsetEnd\":\"33\",\"POS\":\"NN\", \
                    \"NER\":\"O\",\"Speaker\":\"PER0\"},{\"$\":{\"id\":\"8\"},\"word\":\".\",\"lemma\":\".\",\"CharacterOffsetBegin\":\"33\",\"CharacterOffsetEnd\":\"34\", \
                    \"POS\":\".\",\"NER\":\"O\",\"Speaker\":\"PER0\"}]}, \
                    \"parse\":\"(ROOT (S (NP (NN TIME)) (VP (VBZ is) (VP (VBN defined) (S (VP (TO to) (VP (VB be) (NP (DT a) (NN Measure))))))) (. .))) \", \
                    \"dependencies\":[{\"$\":{\"type\":\"basic-dependencies\"},\"dep\":[{\"$\":{\"type\":\"root\"},\"governor\":{\"_\":\"ROOT\",\"$\":{\"idx\":\"0\"}}, \
                    \"dependent\":{\"_\":\"defined\",\"$\":{\"idx\":\"3\"}}},{\"$\":{\"type\":\"nsubjpass\"},\"governor\":{\"_\":\"defined\",\"$\":{\"idx\":\"3\"}}, \
                    \"dependent\":{\"_\":\"TIME\",\"$\":{\"idx\":\"1\"}}},{\"$\":{\"type\":\"auxpass\"},\"governor\":{\"_\":\"defined\",\"$\":{\"idx\":\"3\"}}, \
                    \"dependent\":{\"_\":\"is\",\"$\":{\"idx\":\"2\"}}},{\"$\":{\"type\":\"mark\"},\"governor\":{\"_\":\"Measure\",\"$\":{\"idx\":\"7\"}},\"dependent\": \
                    {\"_\":\"to\",\"$\":{\"idx\":\"4\"}}},{\"$\":{\"type\":\"cop\"},\"governor\":{\"_\":\"Measure\",\"$\":{\"idx\":\"7\"}},\"dependent\":{\"_\":\"be\",\"$\": \
                    {\"idx\":\"5\"}}},{\"$\":{\"type\":\"det\"},\"governor\":{\"_\":\"Measure\",\"$\":{\"idx\":\"7\"}},\"dependent\":{\"_\":\"a\",\"$\":{\"idx\":\"6\"}}},{\"$\": \
                    {\"type\":\"xcomp\"},\"governor\":{\"_\":\"defined\",\"$\":{\"idx\":\"3\"}},\"dependent\":{\"_\":\"Measure\",\"$\":{\"idx\":\"7\"}}}]},{\"$\":{\"type\": \
                    \"collapsed-dependencies\"},\"dep\":[{\"$\":{\"type\":\"root\"},\"governor\":{\"_\":\"ROOT\",\"$\":{\"idx\":\"0\"}},\"dependent\":{\"_\":\"defined\",\"$\": \
                    {\"idx\":\"3\"}}},{\"$\":{\"type\":\"nsubjpass\"},\"governor\":{\"_\":\"defined\",\"$\":{\"idx\":\"3\"}},\"dependent\":{\"_\":\"TIME\",\"$\":{\"idx\":\"1\"}}}, \
                    {\"$\":{\"type\":\"auxpass\"},\"governor\":{\"_\":\"defined\",\"$\":{\"idx\":\"3\"}},\"dependent\":{\"_\":\"is\",\"$\":{\"idx\":\"2\"}}},{\"$\":{\"type\": \
                    \"mark\"},\"governor\":{\"_\":\"Measure\",\"$\":{\"idx\":\"7\"}},\"dependent\":{\"_\":\"to\",\"$\":{\"idx\":\"4\"}}},{\"$\":{\"type\":\"cop\"},\"governor\": \
                    {\"_\":\"Measure\",\"$\":{\"idx\":\"7\"}},\"dependent\":{\"_\":\"be\",\"$\":{\"idx\":\"5\"}}},{\"$\":{\"type\":\"det\"},\"governor\":{\"_\":\"Measure\",\"$\": \
                    {\"idx\":\"7\"}},\"dependent\":{\"_\":\"a\",\"$\":{\"idx\":\"6\"}}},{\"$\":{\"type\":\"xcomp\"},\"governor\":{\"_\":\"defined\",\"$\":{\"idx\":\"3\"}}, \
                    \"dependent\":{\"_\":\"Measure\",\"$\":{\"idx\":\"7\"}}}]},{\"$\":{\"type\":\"collapsed-ccprocessed-dependencies\"},\"dep\":[{\"$\":{\"type\":\"root\"}, \
                    \"governor\":{\"_\":\"ROOT\",\"$\":{\"idx\":\"0\"}},\"dependent\":{\"_\":\"defined\",\"$\":{\"idx\":\"3\"}}},{\"$\":{\"type\":\"nsubjpass\"},\"governor\": \
                    {\"_\":\"defined\",\"$\":{\"idx\":\"3\"}},\"dependent\":{\"_\":\"TIME\",\"$\":{\"idx\":\"1\"}}},{\"$\":{\"type\":\"auxpass\"},\"governor\":{\"_\":\"defined\", \
                    \"$\":{\"idx\":\"3\"}},\"dependent\":{\"_\":\"is\",\"$\":{\"idx\":\"2\"}}},{\"$\":{\"type\":\"mark\"},\"governor\":{\"_\":\"Measure\",\"$\":{\"idx\":\"7\"}}, \
                    \"dependent\":{\"_\":\"to\",\"$\":{\"idx\":\"4\"}}},{\"$\":{\"type\":\"cop\"},\"governor\":{\"_\":\"Measure\",\"$\":{\"idx\":\"7\"}},\"dependent\":{\"_\":\"be\", \
                    \"$\":{\"idx\":\"5\"}}},{\"$\":{\"type\":\"det\"},\"governor\":{\"_\":\"Measure\",\"$\":{\"idx\":\"7\"}},\"dependent\":{\"_\":\"a\",\"$\":{\"idx\":\"6\"}}}, \
                    {\"$\":{\"type\":\"xcomp\"},\"governor\":{\"_\":\"defined\",\"$\":{\"idx\":\"3\"}},\"dependent\":{\"_\":\"Measure\",\"$\":{\"idx\":\"7\"}}}]}],\"parsedTree\": \
                    {\"type\":\"ROOT\",\"children\":[{\"type\":\"S\",\"children\":[{\"type\":\"NP\",\"children\":[{\"type\":\"NN\",\"children\":[{\"type\":\"NN\",\"word\":\"TIME\", \
                    \"id\":1}]}]},{\"type\":\"VP\",\"children\":[{\"type\":\"VBZ\",\"children\":[{\"type\":\"VBZ\",\"word\":\"is\",\"id\":2}]},{\"type\":\"VP\",\"children\": \
                    [{\"type\":\"VBN\",\"children\":[{\"type\":\"VBN\",\"word\":\"defined\",\"id\":3}]},{\"type\":\"S\",\"children\":[{\"type\":\"VP\",\"children\":[{\"type\": \
                    \"TO\",\"children\":[{\"type\":\"TO\",\"word\":\"to\",\"id\":4}]},{\"type\":\"VP\",\"children\":[{\"type\":\"VB\",\"children\":[{\"type\":\"VB\",\"word\": \
                    \"be\",\"id\":5}]},{\"type\":\"NP\",\"children\":[{\"type\":\"DT\",\"children\":[{\"type\":\"DT\",\"word\":\"a\",\"id\":6}]},{\"type\":\"NN\",\"children\": \
                    [{\"type\":\"NN\",\"word\":\"Measure\",\"id\":7}]}]}]}]}]}]}]},{\"type\":\".\",\"children\":[{\"type\":\".\",\"word\":\".\",\"id\":8}]}]}]}}}}}",
                    "httpVesion":"1.1","httpStatusCode":200,"headers":{"content-type":"text/plain","date":"Wed, 22 Jul 2015 06:00:10 GMT","connection":"close",
                    "transfer-encoding":"chunked"}, "trailers":{}};
        var txt2 = {"body":"{\"document\":{\"sentences\":{\"sentence\":[{\"$\":{\"id\":\"1\"},\"tokens\":{\"token\":[{\"$\":{\"id\":\"1\"},\"word\":\"TIME\",\"lemma\":\"time\", \
                   \"CharacterOffsetBegin\":\"0\",\"CharacterOffsetEnd\":\"4\",\"POS\":\"NN\",\"NER\":\"O\",\"Speaker\":\"PER0\"},{\"$\":{\"id\":\"2\"},\"word\":\"is\",\"lemma\": \
                   \"be\",\"CharacterOffsetBegin\":\"5\",\"CharacterOffsetEnd\":\"7\",\"POS\":\"VBZ\",\"NER\":\"O\",\"Speaker\":\"PER0\"},{\"$\":{\"id\":\"3\"},\"word\": \
                   \"defined\",\"lemma\":\"define\",\"CharacterOffsetBegin\":\"9\",\"CharacterOffsetEnd\":\"16\",\"POS\":\"VBN\",\"NER\":\"O\",\"Speaker\":\"PER0\"},{\"$\": \
                   {\"id\":\"4\"},\"word\":\"to\",\"lemma\":\"to\",\"CharacterOffsetBegin\":\"17\",\"CharacterOffsetEnd\":\"19\",\"POS\":\"TO\",\"NER\":\"O\",\"Speaker\":\"PER0\"}, \
                   {\"$\":{\"id\":\"5\"},\"word\":\"be\",\"lemma\":\"be\",\"CharacterOffsetBegin\":\"20\",\"CharacterOffsetEnd\":\"22\",\"POS\":\"VB\",\"NER\":\"O\",\"Speaker\": \
                   \"PER0\"},{\"$\":{\"id\":\"6\"},\"word\":\"a\",\"lemma\":\"a\",\"CharacterOffsetBegin\":\"23\",\"CharacterOffsetEnd\":\"24\",\"POS\":\"DT\",\"NER\":\"O\", \
                   \"Speaker\":\"PER0\"},{\"$\":{\"id\":\"7\"},\"word\":\"Measure\",\"lemma\":\"measure\",\"CharacterOffsetBegin\":\"26\",\"CharacterOffsetEnd\":\"33\",\"POS\": \
                   \"NN\",\"NER\":\"O\",\"Speaker\":\"PER0\"},{\"$\":{\"id\":\"8\"},\"word\":\".\",\"lemma\":\".\",\"CharacterOffsetBegin\":\"33\",\"CharacterOffsetEnd\":\"34\", \
                   \"POS\":\".\",\"NER\":\"O\",\"Speaker\":\"PER0\"}]}, \
                   \"parse\":\"(ROOT (S (NP (NN TIME)) (VP (VBZ is) (VP (VBN defined) (S (VP (TO to) (VP (VB be) (NP (DT a) (NN Measure))))))) (. .))) \",\"dependencies\":[{\"$\": \
                   {\"type\":\"basic-dependencies\"},\"dep\":[{\"$\":{\"type\":\"root\"},\"governor\":{\"_\":\"ROOT\",\"$\":{\"idx\":\"0\"}},\"dependent\":{\"_\":\"defined\",\"$\": \
                   {\"idx\":\"3\"}}},{\"$\":{\"type\":\"nsubjpass\"},\"governor\":{\"_\":\"defined\",\"$\":{\"idx\":\"3\"}},\"dependent\":{\"_\":\"TIME\",\"$\":{\"idx\":\"1\"}}}, \
                   {\"$\":{\"type\":\"auxpass\"},\"governor\":{\"_\":\"defined\",\"$\":{\"idx\":\"3\"}},\"dependent\":{\"_\":\"is\",\"$\":{\"idx\":\"2\"}}},{\"$\":{\"type\":\"mark\"}, \
                   \"governor\":{\"_\":\"Measure\",\"$\":{\"idx\":\"7\"}},\"dependent\":{\"_\":\"to\",\"$\":{\"idx\":\"4\"}}},{\"$\":{\"type\":\"cop\"},\"governor\":{\"_\":\"Measure\", \
                   \"$\":{\"idx\":\"7\"}},\"dependent\":{\"_\":\"be\",\"$\":{\"idx\":\"5\"}}},{\"$\":{\"type\":\"det\"},\"governor\":{\"_\":\"Measure\",\"$\":{\"idx\":\"7\"}}, \
                   \"dependent\":{\"_\":\"a\",\"$\":{\"idx\":\"6\"}}},{\"$\":{\"type\":\"xcomp\"},\"governor\":{\"_\":\"defined\",\"$\":{\"idx\":\"3\"}},\"dependent\":{\"_\": \
                   \"Measure\",\"$\":{\"idx\":\"7\"}}}]},{\"$\":{\"type\":\"collapsed-dependencies\"},\"dep\":[{\"$\":{\"type\":\"root\"},\"governor\":{\"_\":\"ROOT\",\"$\": \
                   {\"idx\":\"0\"}},\"dependent\":{\"_\":\"defined\",\"$\":{\"idx\":\"3\"}}},{\"$\":{\"type\":\"nsubjpass\"},\"governor\":{\"_\":\"defined\",\"$\":{\"idx\": \
                   \"3\"}},\"dependent\":{\"_\":\"TIME\",\"$\":{\"idx\":\"1\"}}},{\"$\":{\"type\":\"auxpass\"},\"governor\":{\"_\":\"defined\",\"$\":{\"idx\":\"3\"}}, \
                   \"dependent\":{\"_\":\"is\",\"$\":{\"idx\":\"2\"}}},{\"$\":{\"type\":\"mark\"},\"governor\":{\"_\":\"Measure\",\"$\":{\"idx\":\"7\"}},\"dependent\": \
                   {\"_\":\"to\",\"$\":{\"idx\":\"4\"}}},{\"$\":{\"type\":\"cop\"},\"governor\":{\"_\":\"Measure\",\"$\":{\"idx\":\"7\"}},\"dependent\":{\"_\":\"be\",\"$\": \
                   {\"idx\":\"5\"}}},{\"$\":{\"type\":\"det\"},\"governor\":{\"_\":\"Measure\",\"$\":{\"idx\":\"7\"}},\"dependent\":{\"_\":\"a\",\"$\":{\"idx\":\"6\"}}},{\"$\": \
                   {\"type\":\"xcomp\"},\"governor\":{\"_\":\"defined\",\"$\":{\"idx\":\"3\"}},\"dependent\":{\"_\":\"Measure\",\"$\":{\"idx\":\"7\"}}}]},{\"$\":{\"type\": \
                   \"collapsed-ccprocessed-dependencies\"},\"dep\":[{\"$\":{\"type\":\"root\"},\"governor\":{\"_\":\"ROOT\",\"$\":{\"idx\":\"0\"}},\"dependent\":{\"_\": \
                   \"defined\",\"$\":{\"idx\":\"3\"}}},{\"$\":{\"type\":\"nsubjpass\"},\"governor\":{\"_\":\"defined\",\"$\":{\"idx\":\"3\"}},\"dependent\":{\"_\":\"TIME\", \
                   \"$\":{\"idx\":\"1\"}}},{\"$\":{\"type\":\"auxpass\"},\"governor\":{\"_\":\"defined\",\"$\":{\"idx\":\"3\"}},\"dependent\":{\"_\":\"is\",\"$\":{\"idx\": \
                   \"2\"}}},{\"$\":{\"type\":\"mark\"},\"governor\":{\"_\":\"Measure\",\"$\":{\"idx\":\"7\"}},\"dependent\":{\"_\":\"to\",\"$\":{\"idx\":\"4\"}}},{\"$\": \
                   {\"type\":\"cop\"},\"governor\":{\"_\":\"Measure\",\"$\":{\"idx\":\"7\"}},\"dependent\":{\"_\":\"be\",\"$\":{\"idx\":\"5\"}}},{\"$\":{\"type\":\"det\"}, \
                   \"governor\":{\"_\":\"Measure\",\"$\":{\"idx\":\"7\"}},\"dependent\":{\"_\":\"a\",\"$\":{\"idx\":\"6\"}}},{\"$\":{\"type\":\"xcomp\"},\"governor\":{\"_\" \
                   :\"defined\",\"$\":{\"idx\":\"3\"}},\"dependent\":{\"_\":\"Measure\",\"$\":{\"idx\":\"7\"}}}]}],\"parsedTree\":{\"type\":\"ROOT\",\"children\":[{\"type\": \
                   \"S\",\"children\":[{\"type\":\"NP\",\"children\":[{\"type\":\"NN\",\"children\":[{\"type\":\"NN\",\"word\":\"TIME\",\"id\":1}]}]},{\"type\":\"VP\", \
                   \"children\":[{\"type\":\"VBZ\",\"children\":[{\"type\":\"VBZ\",\"word\":\"is\",\"id\":2}]},{\"type\":\"VP\",\"children\":[{\"type\":\"VBN\",\"children\": \
                   [{\"type\":\"VBN\",\"word\":\"defined\",\"id\":3}]},{\"type\":\"S\",\"children\":[{\"type\":\"VP\",\"children\":[{\"type\":\"TO\",\"children\":[{\"type\": \
                   \"TO\",\"word\":\"to\",\"id\":4}]},{\"type\":\"VP\",\"children\":[{\"type\":\"VB\",\"children\":[{\"type\":\"VB\",\"word\":\"be\",\"id\":5}]},{\"type\":\"NP\", \
                   \"children\":[{\"type\":\"DT\",\"children\":[{\"type\":\"DT\",\"word\":\"a\",\"id\":6}]},{\"type\":\"NN\",\"children\":[{\"type\":\"NN\",\"word\":\"Measure\", \
                   \"id\":7}]}]}]}]}]}]}]},{\"type\":\".\",\"children\":[{\"type\":\".\",\"word\":\".\",\"id\":8}]}]}]}},{\"$\":{\"id\":\"2\"},\"tokens\":{\"token\":[{\"$\": \
                   {\"id\":\"1\"},\"word\":\"Time\",\"lemma\":\"Time\",\"CharacterOffsetBegin\":\"36\",\"CharacterOffsetEnd\":\"40\",\"POS\":\"NNP\",\"NER\":\"O\",\"Speaker\": \
                   \"PER0\"},{\"$\":{\"id\":\"2\"},\"word\":\"is\",\"lemma\":\"be\",\"CharacterOffsetBegin\":\"41\",\"CharacterOffsetEnd\":\"43\",\"POS\":\"VBZ\", \
                   \"NER\":\"O\",\"Speaker\":\"PER0\"},{\"$\":{\"id\":\"3\"},\"word\":\"Fun\",\"lemma\":\"Fun\",\"CharacterOffsetBegin\":\"44\",\"CharacterOffsetEnd\": \
                   \"47\",\"POS\":\"NNP\",\"NER\":\"O\",\"Speaker\":\"PER0\"},{\"$\":{\"id\":\"4\"},\"word\":\".\",\"lemma\":\".\",\"CharacterOffsetBegin\":\"47\", \
                   \"CharacterOffsetEnd\":\"48\",\"POS\":\".\",\"NER\":\"O\",\"Speaker\":\"PER0\"}]},\"parse\":\"(ROOT (S (NP (NNP Time)) (VP (VBZ is) (NP (NNP Fun))) (. .))) \", \
                   \"dependencies\":[{\"$\":{\"type\":\"basic-dependencies\"},\"dep\":[{\"$\":{\"type\":\"root\"},\"governor\":{\"_\":\"ROOT\",\"$\":{\"idx\":\"0\"}}, \
                   \"dependent\":{\"_\":\"Fun\",\"$\":{\"idx\":\"3\"}}},{\"$\":{\"type\":\"nsubj\"},\"governor\":{\"_\":\"Fun\",\"$\":{\"idx\":\"3\"}},\"dependent\":{\"_\": \
                   \"Time\",\"$\":{\"idx\":\"1\"}}},{\"$\":{\"type\":\"cop\"},\"governor\":{\"_\":\"Fun\",\"$\":{\"idx\":\"3\"}},\"dependent\":{\"_\":\"is\",\"$\":{\"idx\": \
                   \"2\"}}}]},{\"$\":{\"type\":\"collapsed-dependencies\"},\"dep\":[{\"$\":{\"type\":\"root\"},\"governor\":{\"_\":\"ROOT\",\"$\":{\"idx\":\"0\"}},\"dependent\" \
                   :{\"_\":\"Fun\",\"$\":{\"idx\":\"3\"}}},{\"$\":{\"type\":\"nsubj\"},\"governor\":{\"_\":\"Fun\",\"$\":{\"idx\":\"3\"}},\"dependent\":{\"_\":\"Time\",\"$\": \
                   {\"idx\":\"1\"}}},{\"$\":{\"type\":\"cop\"},\"governor\":{\"_\":\"Fun\",\"$\":{\"idx\":\"3\"}},\"dependent\":{\"_\":\"is\",\"$\":{\"idx\":\"2\"}}}]},{\"$\": \
                   {\"type\":\"collapsed-ccprocessed-dependencies\"},\"dep\":[{\"$\":{\"type\":\"root\"},\"governor\":{\"_\":\"ROOT\",\"$\":{\"idx\":\"0\"}},\"dependent\":{\"_\": \
                   \"Fun\",\"$\":{\"idx\":\"3\"}}},{\"$\":{\"type\":\"nsubj\"},\"governor\":{\"_\":\"Fun\",\"$\":{\"idx\":\"3\"}},\"dependent\":{\"_\":\"Time\",\"$\": \
                   {\"idx\":\"1\"}}},{\"$\":{\"type\":\"cop\"},\"governor\":{\"_\":\"Fun\",\"$\":{\"idx\":\"3\"}},\"dependent\":{\"_\":\"is\",\"$\":{\"idx\":\"2\"}}}]}], \
                   \"parsedTree\":{\"type\":\"ROOT\",\"children\":[{\"type\":\"S\",\"children\":[{\"type\":\"NP\",\"children\":[{\"type\":\"NNP\",\"children\":[{\"type\": \
                   \"NNP\",\"word\":\"Time\",\"id\":1}]}]},{\"type\":\"VP\",\"children\":[{\"type\":\"VBZ\",\"children\":[{\"type\":\"VBZ\",\"word\":\"is\",\"id\":2}]}, \
                   {\"type\":\"NP\",\"children\":[{\"type\":\"NNP\",\"children\":[{\"type\":\"NNP\",\"word\":\"Fun\",\"id\":3}]}]}]},{\"type\":\".\",\"children\":[{\"type\": \
                   \".\",\"word\":\".\",\"id\":4}]}]}]}}]},\"coreference\":{\"coreference\":{\"mention\":[{\"$\":{\"representative\":\"true\"},\"sentence\":\"2\",\"start\": \
                   \"1\",\"end\":\"2\",\"head\":\"1\",\"text\":\"Time\"},{\"sentence\":\"1\",\"start\":\"1\",\"end\":\"2\",\"head\":\"1\",\"text\":\"TIME\"},{\"sentence\": \
                   \"2\",\"start\":\"3\",\"end\":\"4\",\"head\":\"3\",\"text\":\"Fun\"}]}}}}",
                   "httpVesion":"1.1","httpStatusCode":200,"headers":{"content-type":"text/plain","date":"Wed, 22 Jul 2015 06:37:12 GMT",
                   "connection":"close","transfer-encoding":"chunked"},"trailers":{}};
/* eslint-enable */
        pp1 = new NLPPP();
        pp2 = new NLPPP();
        this.res1 = pp1.read(txt1.body);
        this.res2 = pp2.read(txt2.body);
    });

    it('txt1 is 1 sentence', ()=>{
        assert.equal(1, pp1.sentenceCount());
    });
    it('txt2 is 2 sentence', ()=>{
        assert.equal(2, pp2.sentenceCount());
    });
    it('txt1 parse tree', ()=>{
        let pt = '(ROOT (S (NP (NN TIME)) (VP (VBZ is) (VP (VBN defined) (S (VP (TO to) (VP (VB be) (NP (DT a) (NN Measure))))))) (. .)))';
        assert.equal(pt, pp1.getParseTree(0));
        assert.equal(pt, pp1.getParseTree(Math.random()*100));
    });
    it('txt2 parse tree', ()=>{
        let pt0='(ROOT (S (NP (NN TIME)) (VP (VBZ is) (VP (VBN defined) (S (VP (TO to) (VP (VB be) (NP (DT a) (NN Measure))))))) (. .)))';
        let pt1='(ROOT (S (NP (NNP Time)) (VP (VBZ is) (NP (NNP Fun))) (. .)))';
        assert.equal(pt0, pp2.getParseTree(0));
        assert.equal(pt1, pp2.getParseTree(1));
    });
    it('txt1 tokens', ()=>{
        let tkn=pp1.getTokens(0);
        var tknData = "TIME is defined to be a Measure .".split(' ');
        var tknPOS = "NN VBZ VBN TO VB DT NN .".split(' ');
        for (var cnt = 0 ; cnt < tknData.length; cnt = cnt + 1) {
            assert.equal(tknData[cnt], tkn.getToken(cnt + 1));
            assert.equal(tknPOS[cnt], tkn.getTokenPOS(cnt + 1));
        }
    });

    it('txt2 sent1 tokens', ()=>{
        let tkn = pp2.getTokens(0);
        var tknData = "TIME is defined to be a Measure .".split(' ');
        var tknPOS = "NN VBZ VBN TO VB DT NN .".split(' ');
        for (var cnt = 0 ; cnt < tknData.length; cnt = cnt + 1) {
            assert.equal(tknData[cnt], tkn.getToken(cnt + 1));
            assert.equal(tknPOS[cnt], tkn.getTokenPOS(cnt + 1));
        }
    });

    it('txt2 sent2 tokens', ()=>{
        let tkn=pp2.getTokens(1);
        var tknData = "Time is Fun .".split(' ');
        var tknPOS = "NNP VBZ NNP .".split(' ');
        for (var cnt = 0 ; cnt < tknData.length; cnt = cnt + 1) {
            assert.equal(tknData[cnt], tkn.getToken(cnt + 1));
            assert.equal(tknPOS[cnt], tkn.getTokenPOS(cnt + 1));
        }
    });

    it('txt1 dep test', ()=>{
        let dep = pp1.getSentenceDep(0);
        assert.equal(7, dep.getDepCount());
        assert.equal(3, dep.getRootToken());
    });
    it('txt2 dep test', ()=>{
        let dep1 = pp2.getSentenceDep(0);
        let dep2 = pp2.getSentenceDep(1);
        assert.equal(7, dep1.getDepCount());
        assert.equal(3, dep2.getDepCount());
        assert.equal(3, dep1.getRootToken());
        assert.equal(3, dep2.getRootToken());
    });

    it('txt1 dep child', ()=>{
        let dep = pp1.getSentenceDep(0);
        let d1 = dep.getChildNodes(dep.getRootToken());
        assert.equal(3, d1.length);
        assert.equal(1, d1[0].tokenIdx);
        assert.equal('nsubjpass', d1[0].type);
        assert.equal(2, d1[1].tokenIdx);
        assert.equal('auxpass', d1[1].type);
    });
    it('txt1 dep parent', ()=>{
        let dep = pp1.getSentenceDep(0);
        let d2 = dep.getParentNodes(1);
        assert.equal(1, d2.length);
        assert.equal(3, d2[0].tokenIdx);
        assert.equal('nsubjpass', d2[0].type);
    });
});

