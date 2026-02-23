# Logic Design (Week 0 - CS50x Scratch)

## Core Idea

* **Theme:** "The Data Collector" (Optimización de sistemas industriales).
* **Author:** Christian Marcos Moraes Pedrozo.
* **Sprites:**
* **Robot (Player):** Controlado por el cursor del ratón.
* **Data (Crystal):** Recurso a recolectar.
* **Bug (Ghost):** Virus que compromete la integridad del sistema.



## Global Variables

* **`Processed Data`**: Puntos acumulados (Meta: 50).
* **`System Integrity`**: Vida del robot (Inicia en 3).
* **`Cooldown`**: Flag de inmunidad temporal (0 = Vulnerable, 1 = Inmune).

---

## Custom Block: `update_game (target_score)`

Este es el motor central de lógica que se ejecuta en cada frame.

**Pseudocode:**

```text
Define update_game (target_score)
    // 1. Detección de Recolección
    Si tocando "Data" entonces:
        Cambiar Processed Data por 1
        Iniciar sonido "Magic Spell"
        Enviar mensaje "collect_data"
        Si Processed Data = target_score entonces:
            Decir "System Optimized! Capture the Virus to Win!" por 2 segundos
        Fin si
    Fin si

    // 2. Gestión de Daño y Victoria
    Si tocando "Bug" Y Cooldown = 0 entonces:
        Si Processed Data < target_score entonces:
            Cambiar System Integrity por -1
            Enviar mensaje "hit_bug"
            Si System Integrity < 1 entonces:
                Decir "System Compromised" por 2 segundos
                Detener todos
            Fin si
        Si no (Modo Victoria activado):
            Enviar mensaje "kill_bug"
            Decir "Virus Detected! System Restored!" por 2 segundos
            Detener todos
        Fin si
    Fin si

```

---

## Sprites Scripts (Detailed)

### 1. Robot (Player)

* **Setup & Loop Principal:** Al presionar bandera, se posiciona en `x:0, y:0`, presenta el proyecto, inicializa variables y entra en el bucle de seguimiento del ratón llamando a `update_game` con valor **50**.
* **Sistema de Inmunidad:** Al recibir `hit_bug`, activa el `Cooldown`, aplica efecto `ghost` al 50% por 2 segundos para dar feedback visual de protección.
* **Música de Fondo:** Un bucle independiente que reproduce **"Video Game 2"** de forma continua.

### 2. Data (Crystal)

* **Comportamiento Autónomo:** Se mueve a una posición aleatoria cada 1 a 5 segundos.
* **Recolección:** Al recibir el mensaje `collect_data`, se teletransporta instantáneamente a una nueva ubicación.

### 3. Bug (Ghost)

* **Patrullaje:** Al iniciar, se muestra (`show`), apunta en una dirección aleatoria y rebota en los bordes constantemente.
* **Interacción de Daño:** Al recibir `hit_bug`, se mueve a una posición aleatoria para evitar el "stunlock" del jugador.
* **Eliminación:** Al recibir `kill_bug` (victoria), se oculta (`hide`) del escenario.

---

## Checklist de Requisitos Técnicos

* [x] **Custom Block con Input:** Implementado mediante `target_score`.
* [x] **Uso de Mensajes:** `collect_data`, `hit_bug` y `kill_bug` sincronizan a los sprites.
* [x] **Variables en Inglés:** Cumplido para estandarización de Harvard.

