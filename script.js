let codeword = "";
let generator = "";

// Function to perform XOR division and visualize steps
function xorDivision(dividend, divisor) {
    let n = divisor.length;
    let temp = dividend.split('');
    let visualization = "";

    for (let i = 0; i <= temp.length - n; i++) {
        visualization += `Step ${i+1}: Current bits = ${temp.slice(i, i+n).join('')}\n`;
        if (temp[i] === '1') {
            for (let j = 0; j < n; j++) {
                temp[i+j] = temp[i+j] === divisor[j] ? '0' : '1';
            }
            visualization += `XOR with divisor: ${divisor} => Remainder now = ${temp.slice(i, i+n).join('')}\n`;
        } else {
            visualization += "Leading bit is 0, no XOR performed\n";
        }
    }

    let remainder = temp.slice(temp.length - n + 1).join('');
    visualization += `Final Remainder: ${remainder}\n`;
    return { remainder, visualization };
}

// Function to encode message
function encodeCRC() {
    let message = document.getElementById('message').value.trim();
    generator = document.getElementById('generator').value.trim();

    if (!message || !generator) {
        alert("Please enter both message and generator.");
        return;
    }

    let n = generator.length - 1;
    let paddedMessage = message + '0'.repeat(n);

    let { remainder, visualization } = xorDivision(paddedMessage, generator);

    codeword = message + remainder;

    document.getElementById('visualization').textContent = visualization;
    document.getElementById('codewordDisplay').textContent = "CRC Codeword: " + codeword;
    document.getElementById('checkResult').textContent = "";
}

// Function to introduce errors
function introduceError() {
    if (!codeword) {
        alert("Encode a message first!");
        return;
    }

    let positionsInput = document.getElementById('errorPositions').value.trim();
    if (!positionsInput) return;

    let positions = positionsInput.split(',').map(p => parseInt(p.trim()));

    let codeArray = codeword.split('');
    positions.forEach(pos => {
        if (pos >= 0 && pos < codeArray.length) {
            codeArray[pos] = codeArray[pos] === '1' ? '0' : '1';
        }
    });

    codeword = codeArray.join('');
    document.getElementById('codewordDisplay').textContent = "Corrupted Codeword: " + codeword;
}

// Function to check codeword
function checkCRC() {
    if (!codeword || !generator) {
        alert("Encode a message first!");
        return;
    }

    let { remainder, visualization } = xorDivision(codeword, generator);

    document.getElementById('visualization').textContent = visualization;

    if (remainder.includes('1')) {
        document.getElementById('checkResult').textContent = "Error detected in received codeword!";
    } else {
        document.getElementById('checkResult').textContent = "No error detected. Codeword is correct.";
    }
}
