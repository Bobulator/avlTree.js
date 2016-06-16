"use strict";

var avlTree = function(initialRoot, initialSize) {

    function Node(height, data, leftChild, rightChild) {
        this.height = height;
        this.data = data;
        this.leftChild = leftChild;
        this.rightChild = rightChild;
    }

    var root = initialRoot == null ? null : initialRoot;
    var size = initialSize == null ? 0 : initialSize;

    var api = {
        contains: contains,
        insert: insert,
        remove: remove,
        size: getSize,
        toString: toString
    };

    Object.freeze(api);

    return api;
    
    // PUBLIC METHODS
    
    function contains(data) {
        return containsRecursive(root);

        function containsRecursive(node) {
            if (node == null) {
                return false;
            }
            else if (node.data === data) {
                return true;
            } else {
                if (data < node.data) {
                    return containsRecursive(node.leftChild);
                } else {
                    return containsRecursive(node.rightChild);
                }
            }
        }
    }
    
    function insert(data) {
        var newNode = new Node(1, data, null, null);

        if (size === 0) {
            root = newNode;
        } else {
            root = insertRecursive(root);
        }

        size += 1;
        return size;

        function insertRecursive(node) {
            if (node == null) {
                return newNode;
            }

            if (newNode.data < node.data) {
                node.leftChild = insertRecursive(node.leftChild);
            } else {
                node.rightChild = insertRecursive(node.rightChild);
            }

            node.height = getHeight(node);
            return balance(node);
        }
    }
    
    function remove(data) {
        var tempSize = size;

        if (size === 0) {
            return false;
        }

        root = removeRecursive(root);
        return size !== tempSize;

        function removeRecursive(node) {
            if (node == null) {
                return node;
            } else if (data === node.data) {
                size -= 1;
                node = getReplacementNode(node);
                if (node == null) {
                    return node;
                }
            } else if (data < node.data) {
                node.leftChild = removeRecursive(node.leftChild);
            } else {
                node.rightChild = removeRecursive(node.rightChild);
            }

            node.height = getHeight(node);
            return balance(node);
        }

        function getReplacementNode(node) {
            var replacementNode;

            if (node.leftChild != null && node.rightChild != null) {
                node.leftChild = getReplacementNodeRecursive(node.leftChild);
                node.data = replacementNode.data;
                return node;
            } else {
                return node.leftChild == null ? node.rightChild : node.leftChild;
            }

            function getReplacementNodeRecursive(node) {
                if (node.rightChild == null) {
                    replacementNode = node;
                    return node.leftChild;
                }

                node.rightChild = getReplacementNodeRecursive(node.rightChild);
                node.height = getHeight(node);
                return balance(node);
            }
        }
    }
    
    function getSize() {
        return size;
    }
    
    function toString() {
        if (size === 0) {
            return '';
        }

        var height = root.height;
        var matrix = initMatrix(height);

        recurse(root, 0, Math.pow(2, height-1)-1);
        return printMatrix(matrix);
        
        function recurse(node, row, col) {
            var colAdjust;
            
            if (node == null) {
                return;
            }
            
            matrix[row][col] = node.data;
            
            row += 1;
            colAdjust = Math.pow(2, height-(row+1));
            recurse(node.leftChild, row, col - colAdjust);
            recurse(node.rightChild, row, col + colAdjust);
        }
    }

    // PRIVATE METHODS

    function getHeight(node) {
        var leftChildHeight, rightChildHeight;

        if (node.leftChild == null) {
            leftChildHeight = 0;
        } else {
            leftChildHeight = node.leftChild.height;
        }

        if (node.rightChild == null) {
            rightChildHeight = 0;
        } else {
            rightChildHeight = node.rightChild.height;
        }

        return Math.max(leftChildHeight, rightChildHeight) + 1;
    }

    function balance(node) {
        var balanceFactor, childBalanceFactor;

        balanceFactor = getBalanceFactor(node);

        if (balanceFactor > 1) {
            childBalanceFactor = getBalanceFactor(node.leftChild);

            if (childBalanceFactor < 0) {
                node.leftChild = rotateLeft(node.leftChild);
            }
            node = rotateRight(node);
            adjustHeightAfterBalance(node);

        } else if (balanceFactor < -1) {
            childBalanceFactor = getBalanceFactor(node.rightChild);

            if (childBalanceFactor > 0) {
                node.rightChild = rotateRight(node.rightChild);
            }

            node = rotateLeft(node);
            adjustHeightAfterBalance(node);
        }

        return node;
    }

    function getBalanceFactor(node) {
        var leftChildHeight, rightChildHeight;

        if (node.leftChild == null) {
            leftChildHeight = 0;
        } else {
            leftChildHeight = node.leftChild.height;
        }

        if (node.rightChild == null) {
            rightChildHeight = 0;
        } else {
            rightChildHeight = node.rightChild.height;
        }

        return leftChildHeight - rightChildHeight;
    }

    function adjustHeightAfterBalance(node) {
        node.leftChild.height = getHeight(node.leftChild);
        node.rightChild.height = getHeight(node.rightChild);
        node.height = getHeight(node);
    }

    function rotateRight(node) {
        var tempNode = node.leftChild;
        node.leftChild = tempNode.rightChild;
        tempNode.rightChild = node;

        return tempNode;
    }

    function rotateLeft(node) {
        var tempNode = node.rightChild;
        node.rightChild = tempNode.leftChild;
        tempNode.leftChild = node;

        return tempNode;
    }
};

function initMatrix(height) {
    var matrix = [];
    var rows = height;
    var cols = Math.pow(2, height)-1;
    
    for (var row = 0; row < rows; row++) {
        matrix.push([]);
        for (var col = 0; col < cols; col++) {
            matrix[row].push(" ");
        }
    }
    
    return matrix;
}

function printMatrix(matrix) {
    var result = '';
    for (var row = 0; row < matrix.length; row++) {
        result += matrix[row].join("") + "\n";
    }
    return result;
}

module.exports = avlTree;