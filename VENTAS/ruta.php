<?php
include 'conexion.php';

// Consulta productos activos
$sql = "SELECT producto_id, producto_codigo, producto_nombre, producto_stock_total, producto_precio_venta, producto_marca 
        FROM producto";

$resultado = $conexion->query($sql);

$productos = [];

while ($fila = $resultado->fetch_assoc()) {
    $productos[] = $fila;
}

header('Content-Type: application/json');
echo json_encode($productos);
?>
