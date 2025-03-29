# Overview of the Tracks

## Project Study Guide

This study guide outlines the steps to be taken in the project, helping your team to plan the activities. In the week tables below, the main tasks to be completed in the project are categorized per track:

| Task Category         | Abbreviation | Related Track                          |
|-----------------------|--------------|----------------------------------------|
| System definition     | S            | [Track 1](html/tracks-system.html)     |
| Model development     | M            | [Track 2](html/tracks-model.html)      |
| Experimental validation | E          | [Track 3](html/tracks-experiment.html) |
| Individual            | I            | [Track 4](html/tracks-process.html)    |

For each task, it is indicated what other tasks it depends on, and for which follow-up tasks it is required. Note that the [scheduled sessions](#activities) - for which attendance is mandatory - are not included in the weekly task tables.

*Your group is responsible for planning the activities leading to the project goals and deliverables.* In the weekly tutor meetings, you will define self-study assignments. The defined self-study assignments should cover all tasks to be completed. *A self-study assignment should reflect two hours of work.* Many of the tasks are bigger than a single self-study assignment. You should then specify the self-study assignment in detail and indicate to which task it contributes. A team member should contribute to multiple tasks if a specific task costs less than two hours.

Your tutor will monitor the contributions of all members to the project tasks. To ensure that everyone is involved in all aspects of the project, the following rules apply:

- *The individual tasks are to be completed by all team members.*
- *Each team member should contribute at least two self-study assignments to each task category/track.*
- *When multiple team members contribute to a single task, the specific activities for each team member should be clarified and noted down by the tutor.*

---

## Week 1

| Task | Description                                                                                                   | Depends on | Required for                                                                 |
|------|---------------------------------------------------------------------------------------------------------------|------------|------------------------------------------------------------------------------|
| ~~I1~~   | ~~Formulate your *individual learning goals*.~~                                                                   | ~~-~~          | ~~Individual goals formulation, I3, I4~~                                         |
| ~~S1~~   | ~~Perform a *literature review on EST systems*. Tabulate the explored systems in terms of essential storage characteristics, such as storage duration, storage capacity, and system size.~~ | ~~-~~          | ~~S2~~                                                                           |
| ~~I2~~   | ~~Get yourself *acquainted with Simulink* by working on the “On ramp” tutorial.~~                                | ~~-~~          | ~~Simulink tutorial, M1~~                                                        |
| ~~M1~~   | ~~Install the *Simulink EST model* and use it to *analyze the supply and demand* signals. Define requirements for the EST system, such as storage duration and storage capacity.~~ | ~~I2~~        | ~~Go/no-go, S2, M4~~                                                             |
| ~~E1~~   | ~~*Explore the experimental toolboxes* during your PROTO/zone session.~~                                          | ~~-~~          | ~~E2~~                                                                           |
| ~~S2~~   | ~~Develop the *conceptual idea of a sustainable and innovative EST system*, which is compatible with the requirements following from the supply and demand.~~ | ~~S1, M1~~    | ~~Go/no-go, E2, S3~~                                                             |
| ~~E2~~   | ~~Develop a *conceptual idea for the validation experiment*. Describe what physical law is to be validated and explain its position in the overall validation process. Specify with which toolbox the experiment can be realized.~~ | ~~E1, S2~~    | ~~Go/no-go, SOP (v1), E3, E8~~                                                   |

---

## Week 2

| Task | Description                                                                                                   | Depends on | Required for                                                                 |
|------|---------------------------------------------------------------------------------------------------------------|------------|------------------------------------------------------------------------------|
| ~~S3~~   | ~~Specify all *relevant components of the EST system*, that is: the injection, the extraction, the actual storage, and the transport to and from the storage. Make sure that all components are realistic in relation to the real-world setting of the EST system.~~ | ~~S2~~        | ~~Poster, M2, S4, S5~~                                                          |
| ~~M2~~   | ~~Identify the *physical phenomena* that are (most) relevant for the chosen system and its sub-components.~~      | ~~S3~~        | ~~Poster, M3~~                                                                  |
| ~~M3~~   | ~~Explore physical laws for the relevant physical phenomena, and *select model components* with a relevant level of complexity to adequately describe the phenomena. Be aware of the assumptions and simplifications and their effect on the outcome.~~ | ~~M2~~        | ~~Poster, S4, M4~~                                                              |
| ~~E3~~   | ~~Specify what needs to be measured by the experiment to validate the considered physical law. Explore and gather the *components and sensors* required for the experimental setup and study how they should connect to each other.~~ | ~~E2~~        | ~~SOP (v1), E4, E5, E8~~                                                        |

---

## Week 3

| Task | Description                                                                                                   | Depends on | Required for                                                                 |
|------|---------------------------------------------------------------------------------------------------------------|------------|------------------------------------------------------------------------------|
| ~~S4~~   | ~~Determine the *parameters of all components* (dimensions, material properties, etc.) of your real-world EST system that are required for the model.~~ | ~~S3, M3~~    | ~~Poster, S5, M5, S6~~                                                          |
| ~~M4~~   | ~~Study the energy flow structure of the Simulink computer model and *elaborate the mathematical models* describing the physical phenomena such that they fit in this structure.~~ | ~~M1, M3~~    | ~~M5~~                                                                          |
| ~~E4~~   | ~~Make a *design of the setup* in the form of a schematic in which all components and sensors are identified.~~   | ~~E3~~        | ~~SOP (v1), E6, E7, E8~~                                                        |
| ~~E5~~   | ~~Perform the *mandatory safety self-assessment* for your envisioned experiments.~~                               | ~~E3~~        | ~~SOP (v1), E8~~                                                                |
| ~~I3~~   | ~~*Reflect on the individual learning goals* that you formulated at the start of the project.~~                   | ~~I1~~        | ~~Individual goals reflection, I4~~                                             |
| ~~I4~~   | ~~Prepare for the *interim tutor and peer assessment*.~~                                                          | ~~I1, I3~~    | ~~Interim assessment~~                                                          |

---

## Week 4

| Task | Description                                                                                                   | Depends on | Required for                                                                 |
|------|---------------------------------------------------------------------------------------------------------------|------------|------------------------------------------------------------------------------|
| ~~S5~~   | ~~Create a *concept for an infographic* that gives a comprehensive overview of the EST system. Make sure that the infographic gives a general overview of the system (components, flow of energy, etc.) and provides technical details (dimensions, powers, etc.).~~ | ~~S3, S4~~    | ~~S7~~                                                                          |
| ~~M5~~   | ~~*Implement the elaborated mathematical model in Simulink* and get this initial model to work for the parameter values of your real-world EST system.~~ | ~~S4, M4~~    | ~~S6, M6~~                                                                      |
| ~~E6~~   | ~~Make *electronic diagrams* in which the wiring of the sensors is explained. Investigate what Arduino code needs to be developed to acquire the data from the sensors.~~ | ~~Measurement theory and practical, E5~~ | ~~SOP (v1), E7, E8~~                                                            |
| ~~E7~~   | ~~Assemble your preliminary *setup on the click board*. Make sure that everything fits and connects well and that the setup looks neat. Include a picture of the assembled setup in the SOP.~~ | ~~E5, E6~~    | ~~SOP (v1), E8~~                                                                |

---

## Week 5

| Task | Description                                                                                                   | Depends on | Required for                                                                 |
|------|---------------------------------------------------------------------------------------------------------------|------------|------------------------------------------------------------------------------|
| ~~S6~~   | ~~Finalize and *tabulate the values of all system parameters* corresponding to the reference design of your EST system. These parameters serve as the input for the model results.~~ | ~~S4, M5~~    | Poster, S7, M7, S8                                                          |
| ~~S7~~   | ~~*Work out the infographic concept* so that a good basis for the professional infographic required by the end of the project is obtained. Make sure that the system parameters used by the model are identifiable in the infographic.~~ | ~~S5, S6~~    | ~~Poster~~                                                                      |
| ~~M6~~   | ~~Finalize your preliminary *Simulink implementation (alpha version)*, making it ready for generating preliminary model results.~~ | ~~M5~~        | ~~M7, M8~~                                                                      |
| ~~M7~~   | ~~Generate *preliminary results using the Simulink model* to demonstrate that it is capable of assessing the performance of the real-world system. Explain how the model can be used to support optimization of the essential system parameters.~~ | ~~S6, M6~~    | ~~Poster~~                                                                      |
| ~~E8~~   | ~~*Demonstrate the first assembly of the experimental setup* on the click board during the PROTO/zone session, explaining: the schematic of the setup, the electronics diagrams, the used components, connections, sensors and Arduino usage. Also address relevant safety aspects.~~ | ~~E2-7~~      | ~~Demo 1~~                                                                      |

---

## Week 6

| Task | Description                                                                                                   | Depends on | Required for                                                                 |
|------|---------------------------------------------------------------------------------------------------------------|------------|------------------------------------------------------------------------------|
| ~~S8~~   | ~~Propose *three design variations* (compared to the reference EST system) and motivate why these alternative designs are interesting to study. Define and tabulate the values of all system parameters corresponding to the three design variations. Make sure that the proposed variations clearly differ.~~ | ~~S6~~        | ~~Technical briefing, S9~~                                                      |
| ~~M8~~   | ~~Work toward the final *Simulink implementation (beta version)*. Make sure that the physical phenomena are described correctly and that the model runs stably for relevant variations of the input parameters.~~ | ~~M6~~        | ~~M9~~                                                                          |
| ~~E9~~   | ~~Assemble the *finalized version of your setup* on the click board. Make sure that everything fits and connects well and that the setup looks neat. Renew the picture of the setup in the SOP.~~ | ~~SOP (v1)~~  | ~~SOP (v2)~~                                                                    |
| ~~E10~~  | ~~Develop the *Arduino code* for the automatic experimental data gathering.~~                                     | ~~SOP (v1)~~  | ~~SOP (v2), E12~~                                                               |
| ~~E11~~  | ~~*Prepare a measurement plan* describing the steps required to execute your experiment and how to gather your experimental data. Start testing the experimental setup and calibrate the sensors.~~ | ~~SOP (v1)~~  | ~~SOP (v2), E14~~                                                               |

---

## Week 7

| Task | Description                                                                                                   | Depends on | Required for                                                                 |
|------|---------------------------------------------------------------------------------------------------------------|------------|------------------------------------------------------------------------------|
| ~~M9~~   | ~~Fix the last bugs and *finalize the Simulink model* so it is able to simulate the performance of the design variations.~~ | ~~M8~~        | ~~S9~~                                                                          |
| ~~S9~~   | ~~*Simulate the proposed design variations* using the developed model. Assess the performance of the EST system variations, paying attention to the validity of the results.~~ | ~~S8, M9~~    | ~~S10~~                                                                         |
| ~~E12~~  | ~~Develop the *codes for the post-processing* of the gathered experimental data.~~                                | ~~E10~~       | ~~E15~~                                                                         |
| ~~E13~~  | ~~*Demonstrate the finalized experimental setup.* All components should be assembled neatly on the click board. The electronics and the software are ready to gather the experimental data. Safety aspects are reflected upon.~~ | ~~E9-11~~     | ~~Demo 2~~                                                                      |
| ~~E14~~  | ~~Finalize the *step-by-step measurement plan* for the experimental procedure and start conducting experiments accordingly. Make sure to pay attention to reproducibility.~~ | ~~E11~~       | ~~SOP (v3), E15~~                                                               |

---

## Week 8

| Task | Description                                                                                                   | Depends on | Required for                                                                 |
|------|---------------------------------------------------------------------------------------------------------------|------------|------------------------------------------------------------------------------|
| ~~S10~~  | ~~*Compare the design variations* making use of the simulation results. Based on this comparison, draw conclusions and formulate suggestions for improvement regarding the suitability of the proposed EST system.~~ | ~~S9~~        | ~~Technical briefing~~                                                          |
| ~~S11~~  | ~~Update the *infographic* based on the feedback received on the interim version. Make sure that the infographic is tailored to the interests of a panel of experts.~~ | ~~Poster~~    | ~~Report, Technical briefing~~                                                  |
| ~~M11~~  | ~~Describe the Simulink model in the report, with a clear *elaboration of the mathematical-physical model and the MATLAB/Simulink implementation*. Summarize the Simulink model in the technical briefing.~~ | M9        | ~~Report, Technical briefing~~                                                  |
| ~~M12~~  | ~~Based on the specification of all essential model parameters for the reference design, present *detailed simulation results* based on which the performance of the EST system is assessed.~~ | ~~M9~~        | ~~Report~~                                                                      |
| ~~E15~~  | ~~Finalize *conducting the experiments* and use the post-processing scripts to visualize the experimental results. Make sure to perform the measurement multiple times, and visualize the measurement uncertainty in the results.~~ | ~~E12, E14~~  | ~~SOP (v3)~~                                                                    |
| ~~E16~~  | ~~Assess the *validity of the considered physical law* by comparing the experimental results with those based on the theory.~~ | ~~E15~~       | ~~SOP (v3), Report~~                                                            |
| ~~E17~~  | ~~*Demonstrate your validation experiment* following the step-by-step measurement plan. Explain the quality of the gathered data in terms of resolution, range, sampling frequency etc. Show the postprocessing of the experimental data, with attention for repeatability and accuracy.~~ | ~~E14-16~~    | ~~Demo 3~~                                                                      |
| ~~E18~~  | ~~Neatly *disassemble your setup*, clean the components, and put them back where you got them from. Hand in the key to your storage locker.~~ | ~~E17~~       | -                                                                           |
| ~~M13~~  | ~~*Reflect on the model development process* by explaining the capabilities and limitations of your Simulink model, the relation between the validation process and the real-world EST Simulink model, and by discussion the lessons learned throughout the project.~~ | ~~All~~       | ~~Report, Technical briefing~~                                                  |
| ~~I5~~   | ~~Prepare for the *final tutor and peer assessment*.~~                                                            | ~~Interim assessment~~ | ~~Final assessment~~                                                            |