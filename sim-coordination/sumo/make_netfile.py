import os
from os import path as osp
import subprocess

import xml.etree.ElementTree as ET
import argparse

# print(os.getcwd())

parser = argparse.ArgumentParser()
parser.add_argument('--root_dir', '--rd', type=str, default='../sim-coordination/sumo', help='Root directory')
parser.add_argument('--segment_num', '--s', type=int, default=1, help='Number of segments')
parser.add_argument('--subsegment_num', '--ss', type=int, default=0, help='Number of subsegments')
parser.add_argument('--seg_x', '--sx', type=float, nargs='+', default=[1.0], help='x coordinates (segment length)')
parser.add_argument('--seg_y', '--sy', type=float, nargs='+', default=[0.0], help='y coordinates')
parser.add_argument('--rad', '--r', type=float, nargs='+', default=[0.0], help='Radius of subsegmnet')
parser.add_argument('--sup_ele', '--se', type=float, nargs='+', default=[0.0], help='Super elevation of subsegmnet')
parser.add_argument('--fdensity', '--fd', type=float, nargs='+', default=[100.0], help='Forward density')
parser.add_argument('--bdensity', '--bd', type=float, nargs='+', default=[100.0], help='Backward density')
parser.add_argument('--vi', type=int, nargs='+', default=[1000], help='Volume')
parser.add_argument('--vo', type=int, nargs='+', default=[0], help='Opposite volume')
parser.add_argument('--num_lanes', '--l', type=int, nargs='+', default=[1], help='Number of lanes')
parser.add_argument('--speed', '--sp', type=float, default=[45.0], nargs='+', help='Post speed limit')
parser.add_argument('--lane_width', '--lw', type=float, default=12.0, help='Lane width')


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
                 fdensity: list[float], bdensity: list[float], vi: list[int], vo: list[int], num_lanes: list[int], speed: list[float], lane_width: float):
        self.root_dir = root_dir

        self.node_root = ET.Element('nodes')
        self.edge_root = ET.Element('edges')
        self.subsegment_num = subsegment_num
        self.segment_num = segment_num
        self.seg_x = [self.convert_mile_to_meter(sx) for sx in seg_x]
        self.seg_y = [self.convert_mile_to_meter(sy) for sy in seg_y]
        self.rad = [self.convert_feet_to_meter(r) for r in rad]
        self.sup_ele = sup_ele
        self.num_lanes = num_lanes
        self.speed = [self.convert_mph_to_kph(sp) for sp in speed]
        self.lane_width = self.convert_feet_to_meter(lane_width)
        self.fdensity = fdensity
        self.bdensity = bdensity
        self.vi = vi
        self.vo = vo

    def create_node_file_from_hcm(self):
        ''' https://sumo.dlr.de/docs/Networks/PlainXML.html#node_descriptions

        <nodes>
            <node id="1" x="-250.0" y="0.0" />
            <node id="2" x="+250.0" y="0.0" />
            <node id="3" x="+251.0" y="0.0" />
        </nodes>
        '''
        self.node_tree = ET.SubElement(self.node_root, 'node', id='1', x='0.0', y='0.0')
        cum_seg_x = 0
        cum_seg_y = 0
        for i in range(1, self.segment_num+1):

            cum_seg_x += self.seg_x[i-1]
            cum_seg_y += self.seg_y[i-1]
            # If there is no subsegment
            if self.subsegment_num == 1:
                print(self.seg_x[i-1])
                self.node_tree = ET.SubElement(self.node_root, 'node', id=str(i+1), x=str(cum_seg_x), y=str(cum_seg_y))

            for j in range(1, self.subsegment_num):
                ET.SubElement(self.node_root, 'node', id=str(i+1), x=str(self.seg_x[i][j]), y=str(self.seg_y[i][j]), z=str(self.sup_ele[i][j]), radius=str(self.rad[i][j]))


    def create_edge_file_from_hcm(self):
        ''' https://sumo.dlr.de/docs/Networks/PlainXML.html#edge_descriptions

        <edges>
            <edge from="1" id="1to2" to="2" />
            <edge from="2" id="out" to="3" />
        </edges>
        '''
        for i in range(1, self.segment_num+1):
            if self.subsegment_num == 1:
                # Forward
                self.edge_tree = ET.SubElement(self.edge_root, 'edge', id=str(i), _from=str(i), to=str(i+1), sampledSecond=str(self.vi[i-1]),
                                                numLanes=str(self.num_lanes[i-1]), speed=str(self.speed[i-1]), length=str(self.seg_x[i-1]), width=str(self.lane_width),
                                                density=str(self.fdensity[i-1]))
                # Backward
                self.edge_tree = ET.SubElement(self.edge_root, 'edge', id=str(i + self.segment_num), _from=str(i+1), to=str(i), sampledSecond=str(self.vo[i-1]), 
                                               numLanes=str(self.num_lanes[i-1]), speed=str(self.speed[i-1]), length=str(self.seg_x[i-1]), width=str(self.lane_width),
                                               density=str(self.bdensity[i-1]))

            for j in range(1, self.subsegment_num):
                ET.SubElement(self.edge_root, 'edge', id=str(i), _from=str(i), to=str(i+1))

    def create_netfile_from_hcm(self):
        '''
        netconvert --node_files=node.nod.xml --edge_files=edge.edg.xml --output_file=out.net.xml
        '''
        node_tree = ET.ElementTree(self.node_root)
        edge_tree = ET.ElementTree(self.edge_root)
        print("Creating the node file")
        self.create_node_file_from_hcm()
        node_tree.write(osp.join(self.root_dir, 'hcm15.nod.xml'), encoding="utf-8")

        print("Creating the edge file")
        self.create_edge_file_from_hcm()
        edge_tree.write(osp.join(self.root_dir, 'hcm15.edg.xml'), encoding="utf-8")

        # Replace syntax
        self.replace_from_in_edge(osp.join(self.root_dir, 'hcm15.edg.xml'))

        # Run netconvert
        subprocess.Popen(["netconvert", "--node-files", osp.join(self.root_dir, 'hcm15.nod.xml'), "--edge-files", osp.join(self.root_dir, "hcm15.edg.xml"), "--output-file", osp.join(self.root_dir, "hcm15.net.xml")])

    
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


hcm_topology = HCMTopology(args.root_dir, args.segment_num, args.subsegment_num, 
                            args.seg_x, args.seg_y, args.rad, args.sup_ele,
                            args.fdensity, args.bdensity, args.vi, args.vo,
                            args.num_lanes, args.speed, args.lane_width)

# print("Creating the netfile")
hcm_topology.create_netfile_from_hcm()

# if __name__ == '__main__':

# #     print("Called inside")
