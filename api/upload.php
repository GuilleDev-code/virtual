<?php
// 1. Configurar cabeceras para permitir peticiones (CORS) si están en diferentes dominios/puertos
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Manejar peticiones OPTIONS (Preflight) si aplica
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 2. Validar que la petición sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido. Debe ser POST."]);
    exit();
}

// 3. Verificar que el archivo y el CI hayan llegado
if (!isset($_FILES['comprobante']) || !isset($_POST['ci'])) {
    http_response_code(400);
    echo json_encode(["error" => "Faltan datos requeridos (archivo o CI)."]);
    exit();
}

$file = $_FILES['comprobante'];
$ci = preg_replace('/[^0-9]/', '', $_POST['ci']); // Limpiar el CI por seguridad

// 4. Definir y asegurar la carpeta de destino
$targetDir = "../comprobantes/";

if (!file_exists($targetDir)) {
    // Crea la carpeta si no existe, con permisos de lectura/escritura
    mkdir($targetDir, 0755, true); 
}

// 5. Procesar el nombre y la extensión del archivo
$originalName = $file['name'];
$ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

// Validar extensiones permitidas por seguridad (imágenes y PDFs)
$allowedTypes = ['jpg', 'jpeg', 'png', 'pdf'];
if (!in_array($ext, $allowedTypes)) {
    http_response_code(400);
    echo json_encode(["error" => "Formato de archivo no permitido. Solo JPG, PNG o PDF."]);
    exit();
}

// Generar nombre único: comprobantes/ci_timestamp.ext
$fileName = $ci . "_" . time() . "." . $ext;
$targetFilePath = $targetDir . $fileName;

// 6. Mover el archivo temporal a la carpeta final
if (move_uploaded_file($file['tmp_name'], $targetFilePath)) {
    // Si todo sale bien, respondemos con la URL/ruta para n8n
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "Archivo subido correctamente.",
        "url" => $targetFilePath // Devolverá algo como: "comprobantes/123456_171456789.jpg"
    ]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Hubo un error al guardar el archivo en el servidor."]);
}