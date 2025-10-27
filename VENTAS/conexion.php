
<?php
$conexion = new mysqli("localhost", "root", "", "ventas");
if ($conexion->connect_error) {
  die("X Error de conexión: " . $conexion->connect_error);
}
?>
