# Logic Design (Week 0 - CS50x Scratch)

## Core Idea

* **Theme:** "The Data Collector" (Industrial systems optimization).
* **Author:** Christian Marcos Moraes Pedrozo.
* **Sprites:**
* **Robot (Player):** Controlled by the mouse cursor.
* **Data (Crystal):** Resource to collect.
* **Bug (Ghost):** Virus that compromises system integrity.



## Global Variables

* **`Processed Data`**: Accumulated points (Goal: 50).
* **`System Integrity`**: Robot life (Starts at 3).
* **`Cooldown`**: Temporary immunity flag (0 = Vulnerable, 1 = Immune).

---

## Custom Block: `update_game (target_score)`

This is the central logic engine that runs each frame.

**Pseudocode:**

```text
Define update_game (target_score)
    // 1. Collection Detection
    If touching "Data" then:
        Change Processed Data by 1
        Start sound "Magic Spell"
        Broadcast message "collect_data"
        If Processed Data = target_score then:
            Say "System Optimized! Capture the Virus to Win!" for 2 seconds
        End if
    End if

    // 2. Damage and Victory Handling
    If touching "Bug" AND Cooldown = 0 then:
        If Processed Data < target_score then:
            Change System Integrity by -1
            Broadcast message "hit_bug"
            If System Integrity < 1 then:
                Say "System Compromised" for 2 seconds
                Stop all
            End if
        Else (Victory mode active):
            Broadcast message "kill_bug"
            Say "Virus Detected! System Restored!" for 2 seconds
            Stop all
        End if
    End if

```

---

## Sprites Scripts (Detailed)

### 1. Robot (Player)

* **Setup & Main Loop:** When the flag is clicked, it positions at `x:0, y:0`, presents the project, initializes variables, and enters the mouse-follow loop calling `update_game` with value **50**.
* **Immunity System:** When receiving `hit_bug`, it activates `Cooldown`, applies the `ghost` effect to 50% for 2 seconds to provide visual protection feedback.
* **Background Music:** An independent loop that plays **"Video Game 2"** continuously.

### 2. Data (Crystal)

* **Autonomous Behavior:** Moves to a random position every 1 to 5 seconds.
* **Collection:** When receiving the `collect_data` message, it teleports instantly to a new location.

### 3. Bug (Ghost)

* **Patrol:** On start, it shows (`show`), points in a random direction, and bounces on the edges constantly.
* **Damage Interaction:** When receiving `hit_bug`, it moves to a random position to avoid player "stunlock".
* **Elimination:** When receiving `kill_bug` (victory), it hides (`hide`) from the stage.

---

## Technical Requirements Checklist

* [x] **Custom Block with Input:** Implemented via `target_score`.
* [x] **Use of Messages:** `collect_data`, `hit_bug`, and `kill_bug` synchronize the sprites.
* [x] **Variables in English:** Fulfilled for Harvard standardization.
