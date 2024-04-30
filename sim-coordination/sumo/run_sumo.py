import os
import sys
import traci

print("Called sumo-py")

sumoBinary = "/usr/bin/sumo-gui"
sumoCmd = [sumoBinary, "-c", "../sim-coordination/sumo/hcm15.sumocfg"]
# Experimental 3D View
# sumoCmd = [sumoBinary, "-c", "../sim-coordination/sumo/hcm15.sumocfg", "--osg-view", "true"]

traci.start(sumoCmd)
step = 0
while step < 1000:
    traci.simulationStep()
    # if traci.inductionloop.getLastStepVehicleNumber("0") > 0:
    #     traci.trafficlight.setRedYellowGreenState("0", "GrGr")
    step += 1

traci.close()