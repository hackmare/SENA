# Victron MultiPlus-II Integration Design
## 3-Phase 120/208V Wye — Generator Transfer and Battery Inverter System

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [AC Sources](#2-ac-sources)
3. [Victron DC System](#3-victron-dc-system)
4. [Operating States](#4-operating-states)
5. [Lazarette Box — Component Layout](#5-lazarette-box--component-layout)
6. [Control Logic](#6-control-logic)
7. [TMAX Differential Sensing](#7-tmax-differential-sensing)
8. [Wiring Summary](#8-wiring-summary)
9. [Bill of Materials](#9-bill-of-materials)
10. [Installation Notes](#10-installation-notes)

---

## 1. System Overview

This system integrates three Victron MultiPlus-II 24/3000/70 120V inverter-chargers into an existing 3-phase 120/208V wye generator system. The Victron units are configured as a 3-phase wye inverter and act as a fourth power source, completely isolated from the generators by an automatic contactor switching system controlled from the 24VDC battery bus.

### Architecture

```
GENERATORS (3)          MAIN PANEL          LAZARETTE BOX         VICTRON (3 units)
                        120/208V Wye
Gen 1 (50kVA)  ──TMAX1──┐               ┌──CB1──CONT1──► AC-OUT-1 L1
Gen 2 (100kVA) ──TMAX2──┼──Panel Bus────┤                AC-OUT-1 L2
Gen 3 (120kVA) ──TMAX3──┘               │                AC-OUT-1 L3
                                        │
                                        └──CB2──CONT2──► AC-IN L1
                                                         AC-IN L2
                                                         AC-IN L3
```

### Core Safety Principle

At all times, exactly one of the following is true:

- **CONT1 closed, CONT2 open** → Victron inverts to panel. No generator on bus.
- **CONT1 open, CONT2 closed** → Generator feeds panel. Victron charges from panel.

These two states are mutually exclusive, enforced by the MCR Form C relay break-before-make contact mechanism.

---

## 2. AC Sources

### 2.1 Generators

| Generator | Engine | Rating | Configuration |
|---|---|---|---|
| Gen 1 | Ford Lehman | 50 kVA | 3-phase 120/208V wye 60Hz |
| Gen 2 | Detroit Diesel 671 | 100 kVA | 3-phase 120/208V wye 60Hz |
| Gen 3 | Detroit Diesel 871 | 120 kVA | 3-phase 120/208V wye 60Hz |

### 2.2 Generator Interconnection

Each generator connects to the main distribution panel through an **ABB SACE TMAX T4M 3-pole circuit breaker**. The three TMAX breakers are key-interlocked — only one can be closed at a time. Operation is fully manual:

1. Operator starts generator engine
2. Operator waits for stable voltage and frequency
3. Operator manually closes TMAX to connect generator to panel bus

### 2.3 Wye System Voltages

| Measurement | Value |
|---|---|
| Line to Neutral (L-N) | 120VAC |
| Line to Line (L-L) | 208VAC (120 × √3) |
| Frequency | 60Hz |
| Neutral | Common unswitched bus throughout |

### 2.4 TMAX Switch State Detection

The TMAX T4M is a 3-pole single-mechanism breaker. All three poles move simultaneously. Sensing L1 only is sufficient to determine the state of all three poles.

| TMAX State | V across L1 pole | Meaning |
|---|---|---|
| Open | ~120VAC (>50V) | Generator disconnected from panel |
| Closed | ~0VAC (<2V) | Generator connected to panel |

The differential voltage across the switch is measured between the generator side and panel side of L1 using the **Schneider RM35UA13MW** voltage monitoring relay set to a 25VAC threshold with built-in hysteresis.

---

## 3. Victron DC System

### 3.1 Inverter-Chargers

| Parameter | Value |
|---|---|
| Units | 3× Victron MultiPlus-II 24/3000/70 120V |
| Configuration | 3-phase wye (L1 master, L2 slave, L3 slave) |
| AC output | 120/208V 3-phase wye 60Hz |
| AC-OUT-1 rating | 35A per unit |
| AC-IN rating | 50A per unit |
| DC input | 24VDC |
| Max charge current | 70A DC per unit |
| Interconnect | VE.Bus RJ45 cables |
| Configuration software | VE.Bus System Configurator + VEConfigure |

### 3.2 Battery Bank

| Parameter | Value |
|---|---|
| Batteries | 4× EcoWorthy 12V 280Ah LiFePO4 |
| Configuration | 2S2P (two strings of 2 in series, paralleled) |
| Nominal voltage | 24VDC |
| Total capacity | 560Ah at 24V |
| Chemistry | LiFePO4 |
| BMS | Internal per battery |

### 3.3 Solar Charging

| Parameter | Value |
|---|---|
| Controllers | 2× Victron SmartSolar MPPT 100\|50 |
| Panels | 12× 560W 28V |
| Panel configuration | To be determined per MPPT input requirements |
| Output | 24VDC battery bus |

### 3.4 3-Phase Configuration

The three MultiPlus-II units are configured using **VE.Bus System Configurator**:

- Unit 1 (L1): Master
- Unit 2 (L2): Slave
- Unit 3 (L3): Slave

Each unit connects its AC-OUT-1 to one phase of the panel bus through CONT1, and its AC-IN to one phase of the panel bus through CONT2.

---

## 4. Operating States

### State 1 — Inverting: No Generator on Panel Bus

**Condition:** All three TMAX breakers open. V across L1 of each TMAX > 50VAC.

| Component | State |
|---|---|
| DSR1, DSR2, DSR3 | Energized. NO contacts closed. |
| Series chain (DSR1.NO + DSR2.NO + DSR3.NO) | Complete. Signal present. |
| MCR Master Relay | De-energized |
| MCR NC contact | Closed → CONT1 coil energized |
| MCR NO contact | Open → TDR not triggered → CONT2 coil off |
| CONT1 (AC-OUT-1) | **CLOSED** — Victron AC-OUT-1 feeds panel bus |
| CONT2 (AC-IN) | **OPEN** — No charging circuit |
| Panel source | Victron 3-phase inverter 120/208V wye |
| Victron mode | Inverting from 24V battery bank |

This state also applies during generator warmup (TMAX open, engine running) — no blackout occurs because the differential voltage across the open TMAX remains high, keeping the DSR energized and CONT1 closed.

### State 2 — Charging: Generator on Panel Bus

**Condition:** Any one TMAX closed. V across L1 of that TMAX < 2VAC.

| Component | State |
|---|---|
| That DSR (1, 2, or 3) | De-energized. NO contact opens. |
| Series chain | Broken. Signal absent. |
| MCR Master Relay | Energized |
| MCR NC contact | Opens first (BBM) → CONT1 coil de-energized |
| MCR NO contact | Closes second (BBM) → TDR triggered |
| TDR | 1-second ON delay, then NO closes |
| CONT1 (AC-OUT-1) | **OPEN** — Victron AC-OUT-1 isolated from panel |
| CONT2 (AC-IN) | **CLOSED after 1 second** — Charging enabled |
| Panel source | Generator 3-phase 120/208V wye |
| Victron mode | Charging 24V battery bank via AC-IN |

### State Transition Summary

```
All TMAX open                    Any TMAX closes
(State 1: Inverting)    ───────────────────────►    (State 2: Charging)

DSR series chain complete        DSR series chain broken
MCR de-energized                 MCR energizes
CONT1 closed (inverter on)       CONT1 opens (NC breaks first — BBM)
CONT2 open (no charging)         CONT2 closes after 1s (NO makes second — BBM)

◄───────────────────────    Any TMAX re-opens
```

---

## 5. Lazarette Box — Component Layout

The lazarette box houses all switching, protection, and control components in two DIN rail sections.

### 5.1 Physical Layout

```
┌─────────────────────────────────────────────────────────────┐
│                    LAZARETTE BOX                            │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         DIN RAIL 2 — 3-POLE AC (120/208VAC)         │   │
│  │                                                     │   │
│  │  [FROM PANEL BUS: L1 L2 L3 N]                      │   │
│  │  ↓ Internal AC bus bars L1 L2 L3 N                 │   │
│  │                                                     │   │
│  │  [N-G BOND]  [CB1 50A]  [CONT1 NC]  [CB2 50A]  [CONT2 NO]  │
│  │              AC-OUT-1   LC1D32       AC-IN       LC1D50  │
│  │              to panel   24VDC coil   to panel   24VDC coil│
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         DIN RAIL 1 — 24VDC CONTROL                  │   │
│  │                                                     │   │
│  │  +24VDC ════════════════════════════════════════    │   │
│  │                                                     │   │
│  │  [F7 2A]  [DSR1]  [DSR2]  [DSR3]  [MCR]  [TDR]    │   │
│  │           F1 F2   F3 F4   F5 F6   Form C  1s ON    │   │
│  │           TMAX1   TMAX2   TMAX3   Finder  RE17RAMU  │   │
│  │                                   55.32            │   │
│  │  0VDC  ════════════════════════════════════════    │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [+24VDC IN from battery bus]  [0VDC IN from battery bus]  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 DIN Rail 2 — AC Components

| Component | Part | Rating | Function |
|---|---|---|---|
| N-G Bond | Jumper bar | — | Neutral-ground bond, only bond point in system |
| CB1 | Schneider GV2 or equivalent | 50A 3-pole | Protection for AC-OUT-1 circuit |
| CONT1 | Schneider LC1D32 + LADN11 | 32A 3-phase, 24VDC coil | Normally closed. Opens AC-OUT-1 when gen on bus |
| CB2 | Schneider GV2 or equivalent | 50A 3-pole | Protection for AC-IN circuit |
| CONT2 | Schneider LC1D50 | 50A 3-phase, 24VDC coil | Normally open. Closes AC-IN when gen on bus (+1s delay) |

#### AC Circuit Path — AC-OUT-1

```
Panel Bus (L1 L2 L3 N)
    │
    └──► CB1 50A 3-pole (protection/isolation)
              │
              └──► CONT1 LC1D32 NC (switching)
                        │
                        └──► Victron AC-OUT-1 terminals
                             L1 → MultiPlus-II Unit 1
                             L2 → MultiPlus-II Unit 2
                             L3 → MultiPlus-II Unit 3
                             N  → common neutral
```

#### AC Circuit Path — AC-IN

```
Panel Bus (L1 L2 L3 N)
    │
    └──► CB2 50A 3-pole (protection/isolation)
              │
              └──► CONT2 LC1D50 NO (switching)
                        │
                        └──► Victron AC-IN terminals
                             L1 → MultiPlus-II Unit 1
                             L2 → MultiPlus-II Unit 2
                             L3 → MultiPlus-II Unit 3
                             N  → common neutral
```

### 5.3 DIN Rail 1 — 24VDC Control Components

| Component | Part | Function |
|---|---|---|
| F7 | Bussmann GMA-2A in DF2CN10 holder | 2A control circuit fuse |
| DSR1 | Schneider RM35UA13MW | Differential voltage relay — TMAX1 L1 sensing |
| DSR2 | Schneider RM35UA13MW | Differential voltage relay — TMAX2 L1 sensing |
| DSR3 | Schneider RM35UA13MW | Differential voltage relay — TMAX3 L1 sensing |
| F1, F2 | Bussmann FNQ-R-2 in DF2CN10 | 2A sensing fuses — TMAX1 L1g and L1p |
| F3, F4 | Bussmann FNQ-R-2 in DF2CN10 | 2A sensing fuses — TMAX2 L1g and L1p |
| F5, F6 | Bussmann FNQ-R-2 in DF2CN10 | 2A sensing fuses — TMAX3 L1g and L1p |
| MCR | Finder 55.32.9.024.0040 in socket 95.85.3 | Master control relay, 24VDC, Form C |
| TDR | Schneider RE17RAMU | Time delay relay, 1 second ON delay, 24VDC |

---

## 6. Control Logic

### 6.1 Signal Flow

```
+24VDC battery bus
    │
    └──[F7 2A]──────────────────────────────────────────────────┐
                                                                │
    ┌──────────────────────────────────────────────────────────┤
    │                                                          │
    ├──► DSR1 B1 (+24V supply)                                │
    ├──► DSR2 B1 (+24V supply)                                │
    ├──► DSR3 B1 (+24V supply)                                │
    │                                                          │
    │   DSR1.NO ──┐                                           │
    │   DSR2.NO ──┼── SERIES ──► MCR coil A1                 │
    │   DSR3.NO ──┘                                           │
    │                                                          │
    │   MCR coil A2 ──────────────────────────────► 0VDC     │
    │                                                          │
    │   MCR Form C contacts:                                   │
    │       NC (21-22) ──────────────────────────► CONT1 A1  │
    │       NO (11-14) ──► TDR coil ──[1s]──────► CONT2 A1  │
    │                                                          │
    │   CONT1 A2 ─────────────────────────────────► 0VDC     │
    │   CONT2 A2 ─────────────────────────────────► 0VDC     │
    │                                                          │
    └──────────────────────────────────────────────────────────┘
```

### 6.2 Series Chain Logic

The three DSR NO contacts wired in series create an AND logic gate:

| DSR1 | DSR2 | DSR3 | Chain | MCR | Meaning |
|---|---|---|---|---|---|
| Closed | Closed | Closed | Complete | De-energized | All TMAX open → Invert |
| Open | Closed | Closed | Broken | Energized | TMAX1 closed → Charge |
| Closed | Open | Closed | Broken | Energized | TMAX2 closed → Charge |
| Closed | Closed | Open | Broken | Energized | TMAX3 closed → Charge |
| Open | Open | Open | Broken | Energized | Multiple TMAX closed → Charge |

### 6.3 Break-Before-Make Sequencing

The Finder 55.32 Form C relay has a single armature carrying both the NC and NO contacts. This guarantees:

```
MCR energizes (any TMAX closes):
    1. NC contact opens  → CONT1 de-energizes → AC-OUT-1 opens   (Victron isolated)
       [mechanical gap — inherent in Form C design]
    2. NO contact closes → TDR triggered → 1 second delay → CONT2 energizes → AC-IN closes

MCR de-energizes (all TMAX open):
    1. NO contact opens  → TDR de-energizes → CONT2 opens immediately (AC-IN opens)
       [mechanical gap]
    2. NC contact closes → CONT1 energizes → AC-OUT-1 closes (Victron reconnected)
```

At no point are both CONT1 and CONT2 closed simultaneously.

### 6.4 The 1-Second Delay

The TDR introduces a 1-second delay before AC-IN closes after MCR energizes. This allows:

- The Victron units to recognize the loss of AC-OUT-1 connection to panel
- The generator to stabilize on the panel bus before charging begins
- Any transient from the switching event to settle

The delay applies only to **closing** AC-IN. Opening is immediate when MCR de-energizes.

---

## 7. TMAX Differential Sensing

### 7.1 Measurement Principle

Voltage is measured differentially across one pole (L1) of each TMAX breaker:

```
Generator side L1 ──[F_gen 2A]──► DSR input A1
Panel side L1    ──[F_pnl 2A]──► DSR input A2

TMAX open:  V(L1g) ≠ V(L1p) → differential ≈ 120VAC → DSR energizes → NO closes
TMAX closed: V(L1g) = V(L1p) → differential ≈ 0VAC → DSR de-energizes → NO opens
```

### 7.2 Why L1 Only Is Sufficient

The TMAX T4M is a 3-pole single-mechanism breaker. All three poles are mechanically linked to one operating handle. It is physically impossible for one pole to be in a different state than the others during normal operation. Therefore sensing L1 gives a definitive state for all three poles.

### 7.3 Why This Works During Generator Warmup

When the generator engine is running but the TMAX is still open:

- Generator side L1 = generator output voltage (~120VAC at some phase angle)
- Panel side L1 = Victron inverter output voltage (~120VAC at different phase angle)
- The two sources are not synchronized, so differential voltage = beat frequency, varying 0–240VAC
- This is always well above the 25VAC threshold
- DSR remains energized → CONT1 remains closed → Victron continues inverting
- **No blackout during generator warmup**

When operator closes TMAX:
- Both sides of L1 are now the same electrical node
- Differential voltage drops to near 0VAC
- DSR de-energizes → series chain breaks → MCR energizes → CONT1 opens, CONT2 closes

### 7.4 DSR Setting

| Parameter | Value |
|---|---|
| Relay | Schneider Electric RM35UA13MW |
| Input | Differential AC voltage A1–A2 |
| Trip threshold | 25VAC (midpoint between 2V and 50V) |
| Hysteresis | Built-in, prevents relay chattering |
| Output | SPDT (COM, NO, NC) |
| Supply | 24VDC from control rail |
| Certification | UL, CSA |

### 7.5 Sensing Wire Requirements

| Parameter | Requirement |
|---|---|
| Wire size | 1.5mm² minimum |
| Fusing | 2A each wire (gen side and panel side) |
| Routing | Separate conduit from AC power wires |
| Do not bundle with | AC power conductors, VE.Bus cables |
| Maximum length | Consult RM35UA13MW datasheet for input impedance |

---

## 8. Wiring Summary

### 8.1 Main Panel to Lazarette Box

| Wire | From | To | Size | Notes |
|---|---|---|---|---|
| L1 AC | Panel L1 bus | Lazarette AC bus L1 | AWG 6 min | 120VAC 50A |
| L2 AC | Panel L2 bus | Lazarette AC bus L2 | AWG 6 min | 120VAC 50A |
| L3 AC | Panel L3 bus | Lazarette AC bus L3 | AWG 6 min | 120VAC 50A |
| N | Panel N bus | Lazarette N bar | AWG 6 min | Neutral |
| T1 L1g sense | TMAX1 gen side L1 | Lazarette DSR1 A1 via F1 | 1.5mm² | 2A fused, separate conduit |
| T1 L1p sense | TMAX1 panel side L1 | Lazarette DSR1 A2 via F2 | 1.5mm² | 2A fused, separate conduit |
| T2 L1g sense | TMAX2 gen side L1 | Lazarette DSR2 A1 via F3 | 1.5mm² | 2A fused, separate conduit |
| T2 L1p sense | TMAX2 panel side L1 | Lazarette DSR2 A2 via F4 | 1.5mm² | 2A fused, separate conduit |
| T3 L1g sense | TMAX3 gen side L1 | Lazarette DSR3 A1 via F5 | 1.5mm² | 2A fused, separate conduit |
| T3 L1p sense | TMAX3 panel side L1 | Lazarette DSR3 A2 via F6 | 1.5mm² | 2A fused, separate conduit |

### 8.2 Lazarette Box to Victron Units

| Wire | From | To | Size | Notes |
|---|---|---|---|---|
| L1 AC-OUT-1 | CONT1 output L1 | Victron Unit 1 AC-OUT-1 L | AWG 6 min | 120VAC 75A rated |
| L2 AC-OUT-1 | CONT1 output L2 | Victron Unit 2 AC-OUT-1 L | AWG 6 min | 120VAC 75A rated |
| L3 AC-OUT-1 | CONT1 output L3 | Victron Unit 3 AC-OUT-1 L | AWG 6 min | 120VAC 75A rated |
| L1 AC-IN | CONT2 output L1 | Victron Unit 1 AC-IN L | AWG 6 min | 120VAC 50A rated |
| L2 AC-IN | CONT2 output L2 | Victron Unit 2 AC-IN L | AWG 6 min | 120VAC 50A rated |
| L3 AC-IN | CONT2 output L3 | Victron Unit 3 AC-IN L | AWG 6 min | 120VAC 50A rated |
| N | Lazarette N-G bond | All Victron N terminals | AWG 6 min | Common neutral |
| G | Lazarette G bar | All Victron PE terminals | AWG 6 min | Safety ground |

### 8.3 Battery Bus to Lazarette Control Rail

| Wire | From | To | Size | Notes |
|---|---|---|---|---|
| +24VDC | Battery bus positive | Lazarette +24V rail via F7 | AWG 10 min | 24VDC control power |
| 0VDC | Battery bus negative | Lazarette 0V rail | AWG 10 min | 24VDC return |

### 8.4 Neutral and Ground Bonding

**The N-G bond exists at one point only: the lazarette box.**

| Location | Bond | Notes |
|---|---|---|
| Lazarette box | N bonded to G | Single system bond point |
| Main panel | No N-G bond | Panel neutral is floating to ground |
| Each generator | N bonded to gen frame at generator | Generator internal bond only |
| Victron units | Internal ground relay handles this | Relay H connects N to chassis when AC-IN absent |

---

## 9. Bill of Materials

### 9.1 AC Components (DIN Rail 2)

| Item | Part Number | Manufacturer | Qty | Unit Cost | Total |
|---|---|---|---|---|---|
| AC-OUT-1 contactor 32A | LC1D32BL | Schneider Electric | 1 | $85 | $85 |
| Auxiliary NC contact block | LADN11 | Schneider Electric | 1 | $15 | $15 |
| AC-IN contactor 50A | LC1D50ABL | Schneider Electric | 1 | $110 | $110 |
| 3-pole 50A breaker CB1 | As specified | Schneider Electric | 1 | $60 | $60 |
| 3-pole 50A breaker CB2 | As specified | Schneider Electric | 1 | $60 | $60 |
| N-G bond jumper | As specified | — | 1 | $5 | $5 |

**DIN Rail 2 subtotal: ~$335**

### 9.2 Control Components (DIN Rail 1)

| Item | Part Number | Manufacturer | Qty | Unit Cost | Total |
|---|---|---|---|---|---|
| Differential voltage relay | RM35UA13MW | Schneider Electric | 3 | $65 | $195 |
| Master control relay MCR | 55.32.9.024.0040 | Finder | 1 | $15 | $15 |
| MCR relay socket | 95.85.3 | Finder | 1 | $8 | $8 |
| Time delay relay TDR | RE17RAMU | Schneider Electric | 1 | $45 | $45 |
| Sensing fuse holders (2A) | DF2CN10 | Schneider Electric | 7 | $8 | $56 |
| Sensing fuses 2A 500VAC | FNQ-R-2 | Bussmann | 7 | $3 | $21 |
| Control fuse 2A | 0GMA002.T | Littelfuse | 1 | $2 | $2 |

**DIN Rail 1 subtotal: ~$342**

### 9.3 Enclosure and Mounting

| Item | Part Number | Manufacturer | Qty | Unit Cost | Total |
|---|---|---|---|---|---|
| Enclosure IP65 | NSYPLM32VG | Schneider Electric | 1 | $65 | $65 |
| DIN rail 35mm 1m | 1002275 | Phoenix Contact | 2 | $12 | $24 |
| Terminal blocks 2.5mm² | 3102500 | Phoenix Contact | 30 | $2 | $60 |
| End brackets | 3022218 | Phoenix Contact | 4 | $1 | $4 |
| Control wire 18AWG | 9470 | Belden | 50ft | $0.50 | $25 |
| Wire labels | M21-250-499 | Brady | 1 | $25 | $25 |

**Enclosure subtotal: ~$203**

### 9.4 Total Estimated Cost

| Section | Cost |
|---|---|
| DIN Rail 2 — AC Components | ~$335 |
| DIN Rail 1 — Control Components | ~$342 |
| Enclosure and Mounting | ~$203 |
| **Total** | **~$880** |

*Note: Does not include Victron units, batteries, solar panels, MPPT controllers, cable, conduit, or labor.*

---

## 10. Installation Notes

### 10.1 Safety Requirements

- **Licensed electrician required** for all work on AC circuits
- **Lockout/tagout** all three generators AND the DC battery bus before any wiring work
- **Verify all wiring** against this document before energizing
- **Double-check N-G bonding** — only one bond point permitted in system
- **Do not bundle** sensing wires with AC power conductors

### 10.2 Victron Configuration

The three MultiPlus-II units must be configured using **VE.Bus System Configurator** for 3-phase operation:

1. Connect MK3-USB interface to VE.Bus port of L1 master unit
2. Connect RJ45 UTP cables between all three units
3. In VE.Bus System Configurator: assign L1 master, L2 slave, L3 slave
4. In VEConfigure for each unit: set input frequency 60Hz, input voltage range 90-140VAC, ground relay ON
5. Verify 3-phase output before connecting to panel

### 10.3 DSR Commissioning

For each RM35UA13MW differential voltage relay:

1. With TMAX open and generator running: verify DSR energizes (NO closes)
2. With TMAX closed: verify DSR de-energizes (NO opens)
3. Adjust threshold potentiometer if needed — target 25VAC
4. Verify no chattering at transition point (hysteresis should prevent this)

### 10.4 System Commissioning Sequence

1. Wire and verify all AC power circuits with sources de-energized
2. Wire and verify 24VDC control circuit from battery bus
3. Verify N-G bond at lazarette box only
4. Power 24VDC control rail from battery bus
5. Verify DSR operation with each TMAX manually operated (no generators running)
6. Verify MCR, CONT1, CONT2 operation follows logic table
7. Start one generator, verify CONT1 opens and CONT2 closes after 1 second
8. Shut down generator, verify CONT2 opens and CONT1 closes
9. Verify Victron 3-phase output with no generator running
10. Repeat generator test for all three generators

### 10.5 Neutral Bonding Verification

Before commissioning, verify with a licensed electrician:

- Each generator's neutral is bonded to the generator frame at the generator only
- The main distribution panel has no N-G bond
- The lazarette box N-G bond is the only system bond
- All Victron PE terminals connect to the lazarette G bar
- Victron internal ground relay (Relay H) is enabled in VEConfigure

### 10.6 Ongoing Maintenance

| Task | Interval |
|---|---|
| Check all AC connection torques | Annual |
| Inspect contactor contacts for wear | Annual |
| Test DSR threshold with known voltages | Annual |
| Verify MCR and TDR operation | Annual |
| Check battery state of health | Per battery manufacturer |
| Clean lazarette box and verify IP65 seal | Semi-annual |

---

*Document prepared based on system design discussion. This document is for reference and planning purposes. All electrical work must be performed by a licensed electrician and verified against applicable codes including ABYC, NFPA 303, and local regulations.*

*Victron MultiPlus-II documentation: Rev 12 — 05/2025*
*External Transfer Switch application manual: Rev 05 — 02/2026*
