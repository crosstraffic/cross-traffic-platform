import os
from os import path as osp
import subprocess

import math
import numpy as np
import xml.etree.ElementTree as ET
import argparse

# print(os.getcwd())

def parse_2d_array(s):
    rows = s.strip().split(';')
    return [[float(num) for num in row.split(' ')] for row in rows]

def parse_2d_array_int(s):
    rows = s.strip().split(';')
    return [[int(num) for num in row.split(' ')] for row in rows]

parser = argparse.ArgumentParser()
parser.add_argument('--root_dir', '--rd', type=str, default='../sim-coordination/sumo', help='Root directory')
parser.add_argument('--segment_num', '--s', type=int, default=1, help='Number of segments')
parser.add_argument('--subsegment_num', '--ss', type=int, nargs='+', default=[1], help='Number of subsegments')
parser.add_argument('--seg_x', '--sx', type=parse_2d_array, nargs='+', default="1.0", help='x coordinates (segment length)')
parser.add_argument('--seg_y', '--sy', type=parse_2d_array, nargs='+', default="0.0", help='y coordinates')
parser.add_argument('--rad', '--r', type=parse_2d_array, nargs='+', default="0.0", help='Radius of subsegmnet')
parser.add_argument('--sup_ele', '--se', type=parse_2d_array, nargs='+', default="0.0", help='Super elevation of subsegmnet')
parser.add_argument('--fdensity', '--fd', type=float, nargs='+', default=[100.0], help='Forward density')
parser.add_argument('--bdensity', '--bd', type=float, nargs='+', default=[100.0], help='Backward density')
parser.add_argument('--vi', type=int, nargs='+', default=[1000], help='Volume')
parser.add_argument('--vo', type=int, nargs='+', default=[0], help='Opposite volume')
parser.add_argument('--num_lanes', '--l', type=int, nargs='+', default=[1], help='Number of lanes')
parser.add_argument('--speed', '--sp', type=float, default=[45.0], nargs='+', help='Post speed limit')
parser.add_argument('--lane_width', '--lw', type=float, default=12.0, help='Lane width')
parser.add_argument('--phv', type=float, nargs='+', default=[5.0], help='Percentage of heavy vehicle')


args = parser.parse_args()
print(osp.join(args.root_dir, 'hcm15.nod.xml'))

class HCMTopology:
    '''
    Make netfile (topology) based on HCM calculator inputs.
    Create node file and edge file, which will be converted to net.xml file using netconvert.

    Arguments:
    - segment_num [Integer]: the number of segments. The number of rows in the 
    - subsegment_num [Integer]: the number of sub segments. The number of rows in the 
    - seg_x [List]: the length of one segment in x direction
    - seg_y [List]: y coordinate. This is calculated by seg_x(subseg_x) and rad.
    - subseg_x [List]: the length of one subsegment in x direction. Total length of subsegments equals to the length of the segment.
    - rad [List]: Radius for each subsegments.
    - sup_ele [List]: Superelevation for each subsegments.
    '''
    def __init__(self, root_dir: str, segment_num: int, subsegment_num: int, seg_x: float, seg_y: list[float], rad: list[float], sup_ele: list[float],
                 fdensity: list[float], bdensity: list[float], vi: list[int], vo: list[int], num_lanes: list[int], speed: list[float], lane_width: float, phv: list[float]):
        self.root_dir = root_dir

        self.node_root = ET.Element('nodes')
        self.edge_root = ET.Element('edges')
        self.add_root = ET.Element('additional')
        self.segment_num = segment_num
        seg_x = np.array(seg_x)[0]
        seg_y = np.array(seg_y)[0]
        rad = np.array(rad)[0]
        sup_ele = np.array(sup_ele)[0]
        self.subsegment_num = np.array(subsegment_num)
        self.seg_x = [[self.convert_mile_to_meter(x) for x in sx] for sx in seg_x]
        # self.seg_y = [[self.convert_mile_to_meter(y) for y in sy] for sy in seg_y]
        self.seg_y = [[0.0 for _ in range(len(sy))] for sy in seg_x]
        self.rad = [[self.convert_feet_to_meter(r) for r in rd] for rd in rad]
        self.sup_ele = sup_ele
        self.num_lanes = num_lanes
        self.speed = [self.convert_mph_to_kph(sp) for sp in speed]
        self.lane_width = self.convert_feet_to_meter(lane_width)
        self.fdensity = fdensity
        self.bdensity = bdensity
        self.vi = vi
        self.vo = vo
        self.phv = phv

    def create_node_file_from_hcm(self):
        ''' https://sumo.dlr.de/docs/Networks/PlainXML.html#node_descriptions

        <nodes>
            <node id="1" x="-250.0" y="0.0" />
            <node id="2" x="+250.0" y="0.0" />
            <node id="3" x="+251.0" y="0.0" />
        </nodes>
        '''
        self.node_tree = ET.SubElement(self.node_root, 'node', id='1_1', x='0.0', y='0.0')
        cum_seg_x = 0
        cum_seg_y = 0
        # Number of the transition points among tangent, spiral, and circular curves.
        spiral_num = 3
        theta = 0
        for i in range(1, self.segment_num+1):
            cum_subseg_x = 0
            for j in range(1, self.subsegment_num[i-1]+1):
                cum_subseg_x += self.seg_x[i-1][j-1]

                ### Horizontal Curve extension --> TODO: Using endpoint
                # if self.rad[i-1][j-1] > 0: # theta will be changed
                #     # For spiral curve
                #     # A = math.sqrt(self.rad[i-1][j-1] * self.seg_x[i-1][j-1])
                #     # X = cum_subseg_x - cum_subseg_x ** 5 / (40 * (A ** 4)) + cum_subseg_x ** 9 / (3456 * (A ** 8))
                #     # Y = cum_subseg_x ** 3 / (6 * A ** 2) - cum_subseg_x ** 7 / (336 * (A ** 6)) + cum_subseg_x ** 11 / (42240 * (A ** 10))
                #     # cum_seg_x += X * np.cos(theta)
                #     # cum_seg_y += Y * np.sin(theta)
                #     # theta += np.arctan(Y / X)
                #     cum_seg_x += X
                #     cum_seg_y += Y
                #     theta += 0
                # else:
                cum_seg_x += self.seg_x[i-1][j-1] * np.cos(theta)
                cum_seg_y += self.seg_x[i-1][j-1] * np.sin(theta)

                # for s in range(spiral_num):


                if i == 1:
                    ET.SubElement(self.node_root, 'node', id=str(i) + '_' + str(j+1), x=str(cum_seg_x), y=str(cum_seg_y), z=str(self.sup_ele[i-1][j-1]), radius=str(self.rad[i-1][j-1]))
                # if i == self.segment_num:
                else:
                    ET.SubElement(self.node_root, 'node', id=str(i) + '_' + str(j), x=str(cum_seg_x), y=str(cum_seg_y), z=str(self.sup_ele[i-1][j-1]), radius=str(self.rad[i-1][j-1]))


    def create_edge_file_from_hcm(self):
        ''' https://sumo.dlr.de/docs/Networks/PlainXML.html#edge_descriptions

        <edges>
            <edge from="1" id="1to2" to="2" />
            <edge from="2" id="out" to="3" />
        </edges>
        '''
        is_first = True
        for i in range(1, self.segment_num+1):
            
            if self.subsegment_num[i-1] == 1:
                if i == 1:
                    # Forward
                    self.edge_tree = ET.SubElement(self.edge_root, 'edge', id=str(i), _from=str(i) + '_1', to=str(i) + '_2', sampledSecond=str(self.vi[i-1]),
                                                    numLanes=str(self.num_lanes[i-1]), speed=str(self.speed[i-1]), length=str(self.seg_x[i-1][0]), width=str(self.lane_width),
                                                    density=str(self.fdensity[i-1]))
                    # Backward
                    self.edge_tree = ET.SubElement(self.edge_root, 'edge', id=str(i + self.segment_num), _from=str(i) + '_2', to=str(i) + '_1', sampledSecond=str(self.vo[i-1]), 
                                                numLanes=str(1), speed=str(self.speed[i-1]), length=str(self.seg_x[i-1][0]), width=str(self.lane_width),
                                                density=str(self.bdensity[i-1]))
                else:
                    if is_first:
                        # Forward
                        self.edge_tree = ET.SubElement(self.edge_root, 'edge', id=str(i), _from=str(i-1) + '_2', to=str(i) + '_1', sampledSecond=str(self.vi[i-1]),
                                                        numLanes=str(self.num_lanes[i-1]), speed=str(self.speed[i-1]), length=str(self.seg_x[i-1][0]), width=str(self.lane_width),
                                                        density=str(self.fdensity[i-1]))
                        # Backward
                        self.edge_tree = ET.SubElement(self.edge_root, 'edge', id=str(i + self.segment_num), _from=str(i) + '_1', to=str(i-1) + '_2', sampledSecond=str(self.vo[i-1]), 
                                                    numLanes=str(1), speed=str(self.speed[i-1]), length=str(self.seg_x[i-1][0]), width=str(self.lane_width),
                                                    density=str(self.bdensity[i-1]))
                        is_first = False
                    else:
                        # Forward
                        self.edge_tree = ET.SubElement(self.edge_root, 'edge', id=str(i), _from=str(i-1) + '_1', to=str(i) + '_1', sampledSecond=str(self.vi[i-1]),
                                                        numLanes=str(self.num_lanes[i-1]), speed=str(self.speed[i-1]), length=str(self.seg_x[i-1][0]), width=str(self.lane_width),
                                                        density=str(self.fdensity[i-1]))
                        # Backward
                        self.edge_tree = ET.SubElement(self.edge_root, 'edge', id=str(i + self.segment_num), _from=str(i) + '_1', to=str(i-1) + '_1', sampledSecond=str(self.vo[i-1]), 
                                                    numLanes=str(1), speed=str(self.speed[i-1]), length=str(self.seg_x[i-1][0]), width=str(self.lane_width),
                                                    density=str(self.bdensity[i-1]))
            else:
                for j in range(1, self.subsegment_num[i-1]+1):
                    edge_id_for = str(i) + '_' + str(j)
                    edge_id_back = str(i + self.segment_num) + '_' + str(self.subsegment_num[i-1] + 1 - j)

                    # Forward
                    if self.subsegment_num[i-1] == j:
                        ### If the subsegment is the end of the segment
                        self.edge_tree = ET.SubElement(self.edge_root, 'edge', id=edge_id_for, _from=str(i) + '_' + str(j), to=str(i) + '_' + str(j+1), sampledSecond=str(self.vi[i-1]),
                                                        numLanes=str(self.num_lanes[i-1]), speed=str(self.speed[i-1]), length=str(self.seg_x[i-1][j-1]), width=str(self.lane_width),
                                                        density=str(self.fdensity[i-1]))
                    else:
                        ### If the subsegment continues
                        self.edge_tree = ET.SubElement(self.edge_root, 'edge', id=edge_id_for, _from=str(i) + '_' + str(j), to=str(i) + '_' + str(j+1), sampledSecond=str(self.vi[i-1]),
                                                        numLanes=str(self.num_lanes[i-1]), speed=str(self.speed[i-1]), length=str(self.seg_x[i-1][j-1]), width=str(self.lane_width),
                                                        density=str(self.fdensity[i-1]))

                    # Backward
                    if self.subsegment_num[-1] == 1:
                        ### If the subsegment at the last segment is 1 (no subsegment)
                        self.edge_tree = ET.SubElement(self.edge_root, 'edge', id=edge_id_back, _from=str(self.segment_num + 1 - i) + '_' + str(self.subsegment_num[-1]), to=str(self.segment_num - i) + '_' + str(self.subsegment_num[-2]), sampledSecond=str(self.vo[i-1]), 
                                                    numLanes=str(1), speed=str(self.speed[i-1]), length=str(self.seg_x[i-1][j-1]), width=str(self.lane_width),
                                                    density=str(self.bdensity[i-1]))
                    else:
                        self.edge_tree = ET.SubElement(self.edge_root, 'edge', id=edge_id_back, _from=str(self.segment_num + 1 - i) + '_' + str(self.subsegment_num[-1] + 2 - j), to=str(self.segment_num + 1 - i) + '_' + str(self.subsegment_num[-1] + 1 - j), sampledSecond=str(self.vo[i-1]), 
                                                    numLanes=str(1), speed=str(self.speed[i-1]), length=str(self.seg_x[i-1][j-1]), width=str(self.lane_width),
                                                    density=str(self.bdensity[i-1]))

    def create_add_file(self):
        '''
        <additional>
            <vTypeDistribution id="typedist1" >
                <vType id="vTypeCar" maxSpeed="35" vClass="passenger" length="4.5" guiShape="passenger" probability="0.9"/>
                <vType id="vTypeBus" maxSpeed="30" vClass="bus" Length="14.63" guiShape="bus" probability="0.1"/>
            </vTypeDistribution>
        </additional>
        '''
        ## TODO: Multiple phv causes an error
        # for i in range(1, self.segment_num+1):
            ## TODO: apply diffrent phv for each segment
            # if self.subsegment_num[0][i-1] == 1:
        add_tree = ET.SubElement(self.add_root, 'vTypeDistribution', id='typedist1')
        # Forward
        add_subtree = ET.SubElement(add_tree, 'vType', id="vTypeCar", maxSpeed=str(self.speed[0]), length="5.0", guiShape="passenger", probability=str(1.0-self.phv[0]/100))
        add_subtree = ET.SubElement(add_tree, 'vType', id="vTypeTruck", maxSpeed=str(self.speed[0]), length="14.63", guiShape="truck/semitrailer", probability=str(self.phv[0]/100))


    def create_netfile_from_hcm(self):
        '''
        netconvert --node_files=node.nod.xml --edge_files=edge.edg.xml --output_file=out.net.xml
        '''
        node_tree = ET.ElementTree(self.node_root)
        edge_tree = ET.ElementTree(self.edge_root)
        add_tree = ET.ElementTree(self.add_root)
        print("Creating the node file")
        self.create_node_file_from_hcm()
        node_tree.write(osp.join(self.root_dir, 'hcm15.nod.xml'), encoding="utf-8")

        print("Creating the edge file")
        self.create_edge_file_from_hcm()
        edge_tree.write(osp.join(self.root_dir, 'hcm15.edg.xml'), encoding="utf-8")

        # Replace syntax
        self.replace_from_in_edge(osp.join(self.root_dir, 'hcm15.edg.xml'))

        print("Creating the additinoal file")
        self.create_add_file()
        add_tree.write(osp.join(self.root_dir, 'hcm15.add.vtype.xml'), encoding="utf-8")

        # Run netconvert
        subprocess.Popen(["netconvert", "--node-files", osp.join(self.root_dir, 'hcm15.nod.xml'), "--edge-files", osp.join(self.root_dir, "hcm15.edg.xml"), "--output-file", osp.join(self.root_dir, "hcm15.net.xml"), "--no-turnarounds"])

    
    def replace_from_in_edge(self, file_path):
        '''
        Syntax "_from" should be replaced by "from".
        '''
        with open(file_path, 'r') as file:
            file_content = file.read()

        modified_content = file_content.replace("_from", "from")

        with open(file_path, 'w') as file:
            file.write(modified_content)


    def convert_inch_to_feet(self, input: float):
        return 0.0833 * input

    def convert_feet_to_meter(self, input: float):
        return 0.3048 * input

    def convert_mile_to_meter(self, input: float):
        return 1609.34 * input
    
    def convert_mph_to_kph(self, input: float):
        return 1.6 * input

    def calc_runoff(self, i):
        if self.speed[i] == 30:
            delta = 0.80
        if self.speed[i] == 40:
            delta = 0.73
        if self.speed[i] == 50:
            delta = 0.67
        if self.speed[i] == 60:
            delta = 0.62
        if self.speed[i] == 70:
            delta = 0.57
        if self.speed[i] >= 80:
            delta = 0.50
            
        L_r = (self.lane_width * 1 * self.sup_ele[0] * 1) / delta
        return L_r

    def calc_spiral(self):
        for i in range(self.segment_num + 1):
            cum_subseg_x = 0
            # L_s_d = max(0.556 * self.speed[i], self.calc_runoff(i))
            for j in range(self.subsegment_num + 1):
                cum_subseg_x += self.seg_x[i][j]
                A = math.sqrt(self.rad[i][j] * self.seg_x[i][j])
                X = cum_subseg_x - cum_subseg_x ** 5 / (40 * (A ** 4)) + cum_subseg_x ** 9 / (3456 * (A ** 8))
                Y = cum_subseg_x ** 3 / (6 * A ** 2) - cum_subseg_x ** 7 / (336 * (A ** 6)) + cum_subseg_x ** 11 / (42240 * (A ** 10))

        return X, Y


hcm_topology = HCMTopology(args.root_dir, args.segment_num, args.subsegment_num, 
                            args.seg_x, args.seg_y, args.rad, args.sup_ele,
                            args.fdensity, args.bdensity, args.vi, args.vo,
                            args.num_lanes, args.speed, args.lane_width, args.phv)

hcm_topology.create_netfile_from_hcm()

