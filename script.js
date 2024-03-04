class Nodo {
    constructor(id, nombre, x, y) {
        this.id = id;
        this.nombre = nombre;
        this.x = x;
        this.y = y;
    }
}

class Arista {
    constructor(nodoInicio, nodoFin, peso) {
        this.nodoInicio = nodoInicio;
        this.nodoFin = nodoFin;
        this.peso = peso;
    }
}

let nodeIdCounter = 1;
let nodos = [];
let aristas = [];
let primerNodoParaArista = null;
let stopNodeCreation = false;  // Flag to control node creation
let crearNodoClicked = false;  // Initialize the flag

const lienzo = document.getElementById('lienzo');
const crearNodoButton = document.getElementById('crearNodoButton');

crearNodoButton.addEventListener('click', () => {
    crearNodoClicked = !crearNodoClicked; // Toggle the flag
    if (crearNodoClicked) {
        //alert('Creating nodes is enabled.');
    }
});

lienzo.addEventListener('click', (event) => {
    if (crearNodoClicked) {
        const newNode = createNode(event);
        if (newNode) {
            lienzo.appendChild(newNode);
            crearNodoClicked = false;  // Reset the flag after creating a node
        }
    } else {
        const clickedNode = event.target.closest('.nodo');
        if (clickedNode) {
            crearAristaEntreNodos(clickedNode);
        } else {
            // Show verification message for clicking on the canvas without creating a node
            const canvasRect = lienzo.getBoundingClientRect();
            const x = event.clientX - canvasRect.left;
            const y = event.clientY - canvasRect.top;
            alert(`Click en (${x}, ${y}) en el lienzo.`);
        }
    }
});


lienzo.addEventListener('dblclick', (event) => {
    const clickedNode = event.target.closest('.nodo');
    if (clickedNode) {
        renameNode(clickedNode);
    }
});

document.getElementById('stopNodeCreationButton').addEventListener('click', () => {
    stopNodeCreation = !stopNodeCreation;
    alert(`Node creation is ${stopNodeCreation ? 'stopped' : 'enabled'}.`);
});

function createNode(event) {
    const canvasRect = lienzo.getBoundingClientRect();
    const x = event.clientX - canvasRect.left;
    const y = event.clientY - canvasRect.top;

    const existingNode = nodos.find(node => Math.abs(node.x - x) < 20 && Math.abs(node.y - y) < 20);

    if (existingNode) {
        alert('Ya existe un nodo en estas coordenadas.');
        return null;
    }

    const node = document.createElement('div');
    const nodeId = nodeIdCounter++;
    const nombre = nodeId;  // Use the ID as the default name

    node.id = `nodo-${nodeId}`;
    node.classList.add('nodo');
    node.style.position = 'absolute';
    node.style.left = `${x - 20}px`;
    node.style.top = `${y - 20}px`;  // Ajusta el origen del nodo al centro
    node.style.width = '40px';
    node.style.height = '40px';
    node.style.backgroundColor = '#47ff94';
    node.style.color = '#000000';
    node.style.borderRadius = '50%';
    node.style.border = '2px solid #000000';
    node.style.display = 'flex';
    node.style.alignItems = 'center';
    node.style.justifyContent = 'center';
    node.style.cursor = 'pointer';
    node.style.zIndex = '1';

    const nodeIdElement = document.createElement('div');
    nodeIdElement.classList.add('nodo-id');
    nodeIdElement.innerText = nodeId;
    node.appendChild(nodeIdElement);

    const newNode = new Nodo(nodeId, nombre, x, y);  // Fix the order of arguments
    nodos.push(newNode);  // Add the new node to the nodos array

    // Actualizar el contenedor de información de nodos
    actualizarInfoNodos(newNode);
    node.dataset.node = JSON.stringify(newNode);

    return node;
}



// Agrega esta función para actualizar el contenedor de información del nodo
function actualizarInfoNodos(nodo) {
    const infoNodos = document.getElementById('infoNodos');

    const infoNodoElement = document.createElement('div');
    infoNodoElement.innerText = `Nodo ${nodo.nombre} con centro en (${nodo.x}, ${nodo.y})`;

    infoNodos.appendChild(infoNodoElement);
}



function renameNode(nodeElement) {
    const nodeIdElement = nodeElement.querySelector('.nodo-id');
    const nodeId = nodeIdElement.innerText;

    const newNode = JSON.parse(nodeElement.dataset.node);
    const newName = prompt('Ingrese el nuevo nombre para el nodo:', newNode.nombre);
    const newId = prompt('Ingrese el nuevo ID para el nodo:', newNode.id);

    if (newName !== null && newId !== null) {
        newNode.nombre = newName;
        newNode.id = newId;
        nodeIdElement.innerText = newId;
        nodeElement.dataset.node = JSON.stringify(newNode);
    }
}

function changeNodeId(nodeId, newId) {
    const nodeToChange = nodos.find(node => node.id === nodeId);

    if (nodeToChange) {
        nodeToChange.id = newId;

        const nodeElement = document.getElementById(`nodo-${nodeId}`);
        if (nodeElement) {
            nodeElement.setAttribute('id', `nodo-${newId}`);
            nodeElement.innerText = newId;
            nodeElement.dataset.node = JSON.stringify(nodeToChange);
        } else {
            alert('No se encontró el nodo en el HTML con el ID especificado.');
        }
    } else {
        alert('No se encontró el nodo con el ID especificado.');
    }
}

function dibujarArista(nodoInicio, nodoFin, peso, isDirectional) {
    const angle = Math.atan2(nodoFin.y - nodoInicio.y, nodoFin.x - nodoInicio.x);
    const length = Math.sqrt(Math.pow(nodoFin.x - nodoInicio.x, 2) + Math.pow(nodoFin.y - nodoInicio.y, 2));
    const centerX = (nodoInicio.x + nodoFin.x) / 2;
    const centerY = (nodoInicio.y + nodoFin.y) / 2;

    const line = document.createElement('div');
    line.classList.add('line');

    // Set z-index of lines lower than nodes
    line.style.zIndex = '0';

    // Calculate the position to prevent displacement
    const positionX = nodoInicio.x;
    const positionY = nodoInicio.y;

    line.style.position = 'absolute';
    line.style.left = `${positionX}px`;
    line.style.top = `${positionY}px`;
    line.style.width = `${length}px`;
    line.style.transform = `rotate(${angle}rad)`;
    line.style.transformOrigin = '0 50%';

    // Add arrow class conditionally
    if (isDirectional) {
        line.classList.add('arrow');

        const arrowheadPositionX = nodoInicio.x + Math.cos(angle) * (length - 20); // Adjusted by 20 pixels 
        const arrowheadPositionY = nodoInicio.y + Math.sin(angle) * (length - 20); // Adjusted by 20 pixels

        // Add arrowhead at the calculated position
        const arrowhead = document.createElement('div');
        arrowhead.classList.add('arrowhead');
        arrowhead.style.position = 'absolute';
        arrowhead.style.left = `${arrowheadPositionX}px`;
        arrowhead.style.top = `${arrowheadPositionY}px`;
        arrowhead.style.transform = `rotate(${angle}rad)`;
        lienzo.appendChild(arrowhead);
    }

    lienzo.appendChild(line);

    line.addEventListener('dblclick', () => {
        const newWeight = prompt('Ingrese el nuevo peso para la arista (puede ser decimal):', peso);
        if (newWeight !== null && !isNaN(parseFloat(newWeight))) {
            text.textContent = newWeight;
        } else {
            alert('El peso ingresado no es válido. El peso no se ha actualizado.');
        }
    });

    const text = document.createElement('div');
    text.classList.add('arista-label');
    text.style.position = 'absolute';

    // Calculate the position of the text (weight) to be in the center of the line
    text.style.top = `${centerY}px`;
    text.style.left = `${centerX}px`;
    text.style.transform = 'translate(-50%, -50%)';
    text.textContent = peso;

    // Set the z-index of text lower than nodes
    text.style.zIndex = '1';

    lienzo.appendChild(text);
}



function crearAristaEntreNodos(nodoDestino) {
    if (!primerNodoParaArista) {
        primerNodoParaArista = nodoDestino;
    } else {
        const segundoNodoParaArista = nodoDestino;
        const peso = prompt('Ingrese el peso de la arista (puede ser decimal):');
        if (peso !== null && !isNaN(parseFloat(peso))) {
            const nuevaArista = new Arista(primerNodoParaArista, segundoNodoParaArista, parseFloat(peso));
            aristas.push(nuevaArista);
            dibujarArista(primerNodoParaArista, segundoNodoParaArista, peso);
            primerNodoParaArista = null;
        } else {
            alert('El peso ingresado no es válido. La arista no se ha creado.');
        }
    }
}



document.getElementById('connectNodesButton').addEventListener('click', connectNodesButton);

document.getElementById('renameNodeButton').addEventListener('click', renameNodeButton);

document.getElementById('deleteNodeButton').addEventListener('click', deleteNodeButton);

function connectNodesButton() {
    try {
        const startNodeId = prompt('Ingrese el ID del nodo de inicio:');
        const endNodeId = prompt('Ingrese el ID del nodo de destino:');

        console.log('Attempting to connect nodes with IDs:', startNodeId, 'and', endNodeId);

        if (!startNodeId || !endNodeId) {
            throw new Error('Se deben proporcionar ID de inicio y destino.');
        }

        const startNode = nodos.find(node => String(node.id) === startNodeId);
        const endNode = nodos.find(node => String(node.id) === endNodeId);

        console.log('Start node:', startNode);
        console.log('End node:', endNode);

        if (startNode && endNode) {
            const isDirectional = confirm('¿La conexión debe ser direccional?');
            const weight = prompt('Ingrese el peso de la arista (puede ser decimal):');

            if (weight !== null && !isNaN(parseFloat(weight))) {
                const newEdge = new Arista(startNode, endNode, parseFloat(weight));
                aristas.push(newEdge);

                dibujarArista(startNode, endNode, weight, isDirectional);
            } else {
                alert('El peso ingresado no es válido. La arista no se ha creado.');
            }
        } else {
            alert('No se encontró alguno de los nodos con los ID especificados.');
        }
    } catch (error) {
        console.error('Error connecting nodes:', error.message);
        alert('Error al conectar nodos. Consulta la consola para obtener más información.');
    }
}



function renameNodeButton() {
    const nodeId = prompt('Ingrese el ID del nodo que desea renombrar:');
    const nodeToRename = nodos.find(node => String(node.id) === nodeId);

    if (nodeToRename) {
        const newName = prompt('Ingrese el nuevo nombre para el nodo:', nodeToRename.nombre);
        const newId = prompt('Ingrese el nuevo ID para el nodo:', nodeToRename.id);

        if (newName !== null && newId !== null) {
            nodeToRename.nombre = newName;
            nodeToRename.id = newId;

            const nodeElement = document.getElementById(`nodo-${nodeId}`);
            if (nodeElement) {
                const newNode = createNode(parseFloat(nodeElement.style.left), parseFloat(nodeElement.style.top));
                newNode.id = `nodo-${newId}`;
                newNode.style.left = nodeElement.style.left;
                newNode.style.top = nodeElement.style.top;
                newNode.querySelector('.nodo-id').innerText = newId;
                newNode.dataset.node = JSON.stringify(nodeToRename);
                lienzo.replaceChild(newNode, nodeElement);
            } else {
                alert('No se encontró el nodo en el HTML con el ID especificado.');
            }
        }
    } else {
        alert('No se encontró el nodo con el ID especificado.');
    }
}

function deleteNodeButton() {
    const nodeId = prompt('Ingrese el ID del nodo que desea eliminar:');
    const nodeIndex = nodos.findIndex(node => String(node.id) === nodeId);

    if (nodeIndex !== -1) {
        const nodeToRemove = nodos[nodeIndex];

        nodos.splice(nodeIndex, 1);

        const updatedNodeId = String(nodeToRemove.id);

        const nodeElement = document.getElementById(`nodo-${updatedNodeId}`);
        if (nodeElement) {
            lienzo.removeChild(nodeElement);

            aristas = aristas.filter(arista => arista.nodoInicio !== nodeToRemove && arista.nodoFin !== nodeToRemove);
        } else {
            alert('No se encontró el nodo en el HTML con el ID especificado.');
        }
    } else {
        alert('No se encontró el nodo con el ID especificado.');
    }
}

// Asociar funciones a los botones
document.getElementById('guardarGrafo').addEventListener('click', guardarGrafo);
document.getElementById('cargarGrafo').addEventListener('click', cargarGrafo);
document.getElementById('limpiarGrafo').addEventListener('click', limpiarGrafo);
document.getElementById('generarMatrizButton').addEventListener('click', generarMatrizButton);


function guardarGrafo() {
    const grafoHTML = document.getElementById('lienzo');

    // Convertir el contenido HTML a una imagen usando html2canvas
    html2canvas(grafoHTML).then(canvas => {
        // Obtener la URL de los datos de la imagen
        const imageData = canvas.toDataURL('image/jpeg');

        // Crear un enlace temporal (a) para descargar la imagen
        const downloadLink = document.createElement('a');
        downloadLink.href = imageData;
        downloadLink.download = 'grafo.jpg';

        // Agregar el enlace al cuerpo del documento y hacer clic en él para iniciar la descarga
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        const grafo = {
            nodos: nodos,
            aristas: aristas
        };
    
        localStorage.setItem('grafo', JSON.stringify(grafo));
        alert('Grafo guardado exitosamente como imagen (JPG) y en el localStorage.')
    });
}

// Función para cargar el grafo desde el localStorage
function cargarGrafo() {
    const grafoGuardado = localStorage.getItem('grafo');

    if (grafoGuardado) {
        const grafo = JSON.parse(grafoGuardado);

        // Limpiar el lienzo antes de cargar el nuevo grafo
        limpiarLienzo();

        // Crear nodos
        grafo.nodos.forEach(nodo => {
            const node = document.createElement('div');
            node.id = `nodo-${nodo.id}`;
            node.classList.add('nodo');
            node.style.position = 'absolute';
            node.style.left = `${nodo.x - 20}px`;
            node.style.top = `${nodo.y - 20}px`;
            node.style.width = '40px';
            node.style.height = '40px';
            node.style.backgroundColor = '#47ff94';
            node.style.color = '#000000';
            node.style.borderRadius = '50%';
            node.style.border = '2px solid #000000';
            node.style.display = 'flex';
            node.style.alignItems = 'center';
            node.style.justifyContent = 'center';
            node.style.cursor = 'pointer';
            node.style.zIndex = '1';

            const nodeIdElement = document.createElement('div');
            nodeIdElement.classList.add('nodo-id');
            nodeIdElement.innerText = nodo.id;
            node.appendChild(nodeIdElement);

            node.dataset.node = JSON.stringify(nodo);

            node.addEventListener('dblclick', (event) => {
                renameNode(node);
            });

            lienzo.appendChild(node);
            nodos.push(nodo);
        });

        // Crear aristas
        grafo.aristas.forEach(arista => {
            const startNode = nodos.find(node => node.id === arista.nodoInicio.id);
            const endNode = nodos.find(node => node.id === arista.nodoFin.id);
            dibujarArista(startNode, endNode, arista.peso);
            aristas.push(arista);
        });

        alert('Grafo cargado exitosamente.');
    } else {
        alert('No se encontró un grafo guardado.');
    }
}

// Función para limpiar el lienzo sin afectar el almacenamiento local
function limpiarLienzo() {
    lienzo.innerHTML = '';
    nodos = [];
    aristas = [];
}

document.getElementById('generarMatrizButton').addEventListener('click', generarMatrizButton);
// ... (Previous code)

document.getElementById('generarMatrizButton').addEventListener('click', function () {
    const matriz = generarMatriz(nodos, aristas);

    if (matriz) {
        alert('Matrix generated successfully.');
        mostrarMatrizEnHTML(matriz.matriz, matriz.nodos, 'matrizContent');
    } else {
        alert('Error generating the matrix. Make sure you have nodes and edges.');
    }
});

// ... (Rest of your script)



//-----------------------------------------------------------------------------------------

function generarMatrizButton() {
    const matrizContainer = document.getElementById('matrizContainer');

    if (!matrizContainer) {
        console.error('Matriz container not found.');
        return;
    }

    alert('Generating matrix...');

    const nodos = obtenerNodos();
    const aristas = obtenerAristas();

    if (nodos.length === 0 || aristas.length === 0) {
        alert('No hay nodos o aristas. Imposible generar la matriz.');
        return;
    }

    alert('Got nodes and edges. Generating matrix...');

    const matriz = generarMatriz(nodos, aristas);

    if (matriz) {
        // Display the matrix details in the alerts
        alert('Matrix generated successfully.\n\nNodos: ' + JSON.stringify(nodos) + '\n\nAristas: ' + JSON.stringify(aristas) + '\n\nMatriz: ' + JSON.stringify(matriz.matriz));
        mostrarMatrizEnHTML(matriz.matriz, matriz.nodos, matrizContainer);
    } else {
        alert('Error al generar la matriz. Asegúrate de tener nodos y aristas.');
    }
}







// Agregar la función que recibe nodos y aristas como parámetros
// Function to generate the adjacency matrix
// ... (Previous code)

function generarMatriz(nodos, aristas) {
    // Create an object to map node names to indices in the matrix
    const nodeIndices = {};
    nodos.forEach((nodo, index) => {
        nodeIndices[nodo.nombre] = index;
    });

    // Create the matrix with default values
    const matriz = Array.from({ length: nodos.length }, () => Array(nodos.length).fill(0));

    aristas.forEach(arista => {
        const i = nodeIndices[arista.nodoInicio.nombre];
        const j = nodeIndices[arista.nodoFin.nombre];

        if (i !== undefined && j !== undefined) {
            matriz[i][j] = arista.peso;
            // Uncomment the line below if the graph is undirected
            // matriz[j][i] = arista.peso;
        } else {
            console.error('Error finding indices for arista:', arista);
        }
    });

    if (matriz.length === 0 || matriz[0].length === 0) {
        console.error('Error generating the matrix. The matrix is empty.');
        return null;
    }

    return { matriz: matriz, nodos: nodos.map(nodo => nodo.nombre) };
}

// ... (Previous code)






// ... (Previous code)

function mostrarMatrizEnHTML(matriz, nodos, matrizContainerId) {
    const matrizContainer = document.getElementById(matrizContainerId);

    if (!matrizContainer) {
        console.error('Matriz container not found.');
        return;
    }

    // Clear the container before displaying the new matrix
    matrizContainer.innerHTML = '';

    // Create the HTML content for the matrix
    let htmlContent = '<table class="matriz-adyacencia">';
    htmlContent += '<tr><th></th>';

    nodos.forEach(nombre => {
        htmlContent += `<th>${nombre}</th>`;
    });

    htmlContent += '</tr>';

    for (let i = 0; i < nodos.length; i++) {
        htmlContent += `<tr><th>${nodos[i]}</th>`;

        for (let j = 0; j < nodos.length; j++) {
            htmlContent += `<td>${matriz[i][j].toString()}</td>`;
        }

        htmlContent += '</tr>';
    }

    htmlContent += '</table>';

    // Set the HTML content in the <p> element
    matrizContainer.innerHTML = htmlContent;
}

// ... (Previous code)


// Example usage:
const matriz = generarMatriz(nodos, aristas);

if (matriz) {
    alert('Matrix generated successfully.');
    mostrarMatrizEnHTML(matriz.matriz, matriz.nodos, 'matrizContainer'); 
} else {
    alert('Error generating the matrix. Make sure you have nodes and edges.');
}




//-----------------------------------------------------------------------------------------------------------------------------------


function obtenerNodos() {
    const nodos = [];
    const nodosElements = document.querySelectorAll('.nodo');
    
    nodosElements.forEach(element => {
        const nodeData = element.dataset.node; // Assuming 'node' is a valid data attribute
        if (nodeData) {
            try {
                const parsedNode = JSON.parse(nodeData);
                nodos.push({ nombre: parsedNode.nombre });
            } catch (error) {
                console.error('Error parsing node data:', error);
            }
        } else {
            console.log('Element with class "nodo" and missing data-node attribute:', element);
        }
    });

    console.log('All elements with class "nodo":', nodosElements);

    alert('Nodos obtenidos: ' + JSON.stringify(nodos));

    return nodos;
}






function obtenerAristas() {
    const aristasElements = document.querySelectorAll('.line');
    const aristas = [];

    aristasElements.forEach(aristaElement => {
        const startNodeElement = aristaElement.parentElement.querySelector('.nodo');
        const endNodeElement = obtenerNodoDestino(aristaElement);

        if (endNodeElement) {
            const startNodeId = startNodeElement.querySelector('.nodo-id').innerText;
            const endNodeId = endNodeElement.querySelector('.nodo-id').innerText;

            const peso = parseFloat(aristaElement.nextElementSibling.textContent);
            aristas.push({ nodoInicio: { nombre: startNodeId }, nodoFin: { nombre: endNodeId }, peso: peso });
        } else {
            alert('No se encontró el nodo de destino.');
        }
    });

    alert('Aristas obtenidas: ' + JSON.stringify(aristas));

    return aristas;
}

function obtenerNodoDestino(aristaElement) {
    const rect = aristaElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let distanciaNodoMasCercano = Number.MAX_SAFE_INTEGER;
    let nodoMasCercano = null;

    // Iterate over all nodes to find the closest one
    document.querySelectorAll('.nodo').forEach(currentNode => {
        const currentRect = currentNode.getBoundingClientRect();
        const currentCenterX = currentRect.left + currentRect.width / 2;
        const currentCenterY = currentRect.top + currentRect.height / 2;

        const distanceToCurrent = Math.hypot(centerX - currentCenterX, centerY - currentCenterY);

        if (distanceToCurrent < distanciaNodoMasCercano) {
            distanciaNodoMasCercano = distanceToCurrent;
            nodoMasCercano = currentNode;
        }
    });

    return nodoMasCercano;
}










