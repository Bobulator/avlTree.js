"use strict";

var chai = require("chai");

var should = chai.should();
var expect = chai.expect;

describe("avlTree tests", function() {
    var avlTree;

    describe("contains", function() {
        var testNode1, testNode2, testNode3, testNode4, testRoot;

        before(function() {
            function Node(height, data, leftChild, rightChild) {
                this.height = height;
                this.data = data;
                this.leftChild = leftChild;
                this.rightChild = rightChild;
            }

            testNode1 = new Node(1, 3, null, null);
            testNode2 = new Node(1, 5, null, null);
            testNode3 = new Node(2, 4, testNode1, testNode2);
            testNode4 = new Node(1, 1, null, null);
            testRoot = new Node(3, 2, testNode4, testNode3);

            avlTree = require("../avlTree.js")(testRoot, 5);
        });

        it("should be true if tree contains an element", function() {
            expect(avlTree.contains(testNode1.data)).to.be.true;
            expect(avlTree.contains(testNode2.data)).to.be.true;
            expect(avlTree.contains(testNode3.data)).to.be.true;
            expect(avlTree.contains(testNode4.data)).to.be.true;
            expect(avlTree.contains(testRoot.data)).to.be.true;
            expect(avlTree.contains(1)).to.be.true;
        });

        it("should be false if tree does not contain an element", function() {
            expect(avlTree.contains(0)).to.be.false;
            expect(avlTree.contains(6)).to.be.false;
        });

        it("should always be false if tree is empty", function() {
            avlTree = require("../avlTree.js")();

            expect(avlTree.contains(1)).to.be.false;
            expect(avlTree.contains(null)).to.be.false;
            expect(avlTree.contains(undefined)).to.be.false;
        });
    });

    describe("insert", function() {

        beforeEach(function() {
            avlTree = require("../avlTree.js")();
        });

        it("should be able to insert elements in the correct order", function() {
            var i;

            for (i = 0; i < 10; i += 2) {
                avlTree.insert(i);
            }

            for (i = 1; i < 10; i += 2) {
                avlTree.insert(i);
            }

            avlTree.size().should.equal(10);
            for (i = 0; i < 10; i++) {
                expect(avlTree.contains(i)).to.be.true;
            }
        });

        it("should do a right rotate when left-left heavy", function() {
            var expectedAVLString = "213";
            avlTree.insert(3);
            avlTree.insert(2);
            avlTree.insert(1);

            avlTree.toString().replace(/\s+/g, "").should.equal(expectedAVLString);
        });

        it("should do a left rotate when right-right heavy", function() {
            var expectedAVLString = "213";
            avlTree.insert(1);
            avlTree.insert(2);
            avlTree.insert(3);

            avlTree.toString().replace(/\s+/g, "").should.equal(expectedAVLString);
        });

        it("should do a left-right rotate when left-right heavy", function() {
            var expectedAVLString = "213";
            avlTree.insert(3);
            avlTree.insert(1);
            avlTree.insert(2);

            avlTree.toString().replace(/\s+/g, "").should.equal(expectedAVLString);
        });

        it("ehould do a right-left rotate when right-left heavy", function() {
            var expectedAVLString = "213";
            avlTree.insert(1);
            avlTree.insert(3);
            avlTree.insert(2);

            avlTree.toString().replace(/\s+/g, "").should.equal(expectedAVLString);
        });

        it("should properly balance after 10 sequential inserts", function() {
            var expectedAVLString = "42813695710"
            var i;
            for (i = 1; i <= 10; i++) {
                avlTree.insert(i);
            }

            avlTree.size().should.equal(10);
            avlTree.toString().replace(/\s+/g, "").should.equal(expectedAVLString);
        });

        it("should work with larger sizes", function() {
            var i, randomInt, testSize, min, max;
            min = 0;
            max = 10;
            testSize = 10000;

            for (i = 0; i < testSize; i++) {
                randomInt = Math.floor(Math.random() * (max - min)) + min;
                avlTree.insert(randomInt);
            }

            avlTree.size().should.equal(testSize);
        });
    });

    describe("remove", function() {
        var expectedAVLString;
        
        beforeEach(function() {
            expectedAVLString = "";
            avlTree = require("../avlTree.js")();
        });
        
        it("should not be able to remove anything from an empty list", function() {
            expect(avlTree.remove(0)).to.be.false;
        });

        it("should return false if attempting to remove an element that is not in the tree", function() {
            expectedAVLString = "3170258469";
            var i;
            for (i = 0; i < 10; i++) {
                avlTree.insert(i);
            }

            avlTree.size().should.equal(10);
            expect(avlTree.remove(-1)).to.be.false;
            avlTree.size().should.equal(10);
            stripWS(avlTree.toString()).should.equal(expectedAVLString);
        });

        it("should result in an empty tree when removing the root of a tree of size 1", function() {
            avlTree.insert(1);

            avlTree.size().should.equal(1);

            expect(avlTree.remove(1)).to.be.true;
            expect(avlTree.contains(1)).to.be.false;
            avlTree.size().should.equal(0);
        });

        it("should properly update root when the initial root gets removed", function() {
            expectedAVLString = "13";
            avlTree.insert(2);
            avlTree.insert(1);
            avlTree.insert(3);

            avlTree.size().should.equal(3);

            expect(avlTree.remove(2)).to.be.true;
            expect(avlTree.contains(2)).to.be.false;
            avlTree.size().should.equal(2);

            expect(avlTree.contains(1)).to.be.true;
            expect(avlTree.contains(3)).to.be.true;
            avlTree.toString().replace(/\s+/g, "").should.equal(expectedAVLString);
        });

        it("should properly delete leaf nodes", function() {
            expectedAVLString = "3172584";
            var i;
            for (i = 0; i < 10; i++) {
                avlTree.insert(i);
            }

            avlTree.size().should.equal(10);
            expect(avlTree.remove(0)).to.be.true;
            expect(avlTree.remove(6)).to.be.true;
            expect(avlTree.remove(9)).to.be.true;
            expect(avlTree.contains(0)).to.be.false;
            expect(avlTree.contains(6)).to.be.false;
            expect(avlTree.contains(9)).to.be.false;
            avlTree.size().should.equal(7);
            stripWS(avlTree.toString()).should.equal(expectedAVLString);
        });

        it("should properly rebalance after deleting leaf nodes", function() {
            expectedAVLString = "73815946";
            var i;
            for (i = 0; i < 10; i++) {
                avlTree.insert(i);
            }

            avlTree.size().should.equal(10);
            expect(avlTree.remove(0)).to.be.true;
            expect(avlTree.remove(2)).to.be.true;
            avlTree.size().should.equal(8);
            stripWS(avlTree.toString()).should.equal(expectedAVLString);
        });

        it("should properly remove mid-level nodes", function() {
            expectedAVLString = "7215159170468131618121419";
            var i;
            for (i = 0; i < 20; i++) {
                avlTree.insert(i);
            }

            avlTree.size().should.equal(20);
            expect(avlTree.remove(11)).to.be.true;
            expect(avlTree.contains(11)).to.be.false;
            avlTree.size().should.equal(19);
            expect(avlTree.remove(3)).to.be.true;
            expect(avlTree.contains(3)).to.be.false;
            avlTree.size().should.equal(18);
            expect(avlTree.remove(10)).to.be.true;
            expect(avlTree.contains(10)).to.be.false;
            avlTree.size().should.equal(17);
            stripWS(avlTree.toString()).should.equal(expectedAVLString);
        });

        it("should save subtrees when removing mid-level nods", function() {
            expectedAVLString = "536147";
            avlTree.insert(5);
            avlTree.insert(2);
            avlTree.insert(6);
            avlTree.insert(1);
            avlTree.insert(4);
            avlTree.insert(7);
            avlTree.insert(3);
            expect(avlTree.remove(2)).to.be.true;
            avlTree.size().should.equal(6);
            stripWS(avlTree.toString()).should.equal(expectedAVLString);
        });

        it("should properly update leftchild after replacing a node with its largest child", function() {
            expectedAVLString = "6371584";
            avlTree.insert(6);
            avlTree.insert(3);
            avlTree.insert(7);
            avlTree.insert(2);
            avlTree.insert(5);
            avlTree.insert(8);
            avlTree.insert(1);
            avlTree.insert(4);
            expect(avlTree.remove(2)).to.be.true;
            avlTree.size().should.equal(7);
            stripWS(avlTree.toString()).should.equal(expectedAVLString);
        });

        it("should do a right rotate when left-left heavy", function() {
            expectedAVLString = "213";
            avlTree.insert(3);
            avlTree.insert(4);
            avlTree.insert(2);
            avlTree.insert(1);

            avlTree.size().should.equal(4);
            expect(avlTree.remove(4)).to.be.true;
            expect(avlTree.contains(4)).to.be.false;
            avlTree.size().should.equal(3);
            stripWS(avlTree.toString()).should.equal(expectedAVLString);
        });

        it("should do a left-right rotate when left-right heavy", function() {
            expectedAVLString = "213";
            avlTree.insert(3);
            avlTree.insert(4);
            avlTree.insert(1);
            avlTree.insert(2);

            avlTree.size().should.equal(4);
            expect(avlTree.remove(4)).to.be.true;
            expect(avlTree.contains(4)).to.be.false;
            avlTree.size().should.equal(3);
            stripWS(avlTree.toString()).should.equal(expectedAVLString);
        });

        it("should do a left rotate when right-right heavy", function() {
            expectedAVLString = "324";
            avlTree.insert(2);
            avlTree.insert(1);
            avlTree.insert(3);
            avlTree.insert(4);

            avlTree.size().should.equal(4);
            expect(avlTree.remove(1)).to.be.true;
            expect(avlTree.contains(1)).to.be.false;
            avlTree.size().should.equal(3);
            stripWS(avlTree.toString()).should.equal(expectedAVLString);
        });

        it("should do a left-right rotate when right-left heavy", function() {
            expectedAVLString = "324";
            avlTree.insert(2);
            avlTree.insert(1);
            avlTree.insert(4);
            avlTree.insert(3);

            avlTree.size().should.equal(4);
            expect(avlTree.remove(1)).to.be.true;
            expect(avlTree.contains(1)).to.be.false;
            avlTree.size().should.equal(3);
            stripWS(avlTree.toString()).should.equal(expectedAVLString);
        });

        it("should work after many tries", function () {
            this.timeout(4000);
            expectedAVLString = "62804";
            var i;

            for (i = 0; i < 10000; i++) {
                avlTree.insert(i);
            }
            avlTree.size().should.equal(10000);
            for (i = 1; i < 10000; i += 2) {
                expect(avlTree.remove(i)).to.be.true;
            }
            avlTree.size().should.equal(5000);
            for (i = 10; i < 10000; i += 2) {
                expect(avlTree.remove(i)).to.be.true;
            }
            avlTree.size().should.equal(5);
            stripWS(avlTree.toString()).should.equal(expectedAVLString);
        });
    });

    describe("toString", function() {
        var expectedAVLString;

        beforeEach(function() {
            expectedAVLString = "";
            avlTree = require("../avlTree.js")();
        });

        it("should return an empty string when tree is empty", function() {
            avlTree.toString().should.equal("");
        });

        it("should work for a tree of size 1", function() {
            expectedAVLString = "1\n";
            avlTree.insert(1);

            avlTree.toString().should.equal(expectedAVLString);
        })

        it("should return a level-order traversal of a non-empty tree", function() {
            avlTree.insert(2);
            avlTree.insert(1);
            avlTree.insert(3);

            avlTree.toString().should.equal(" 2 \n1 3\n");
        });
    });
});

function stripWS(str) {
    return str.replace(/\s+/g, "");
}










