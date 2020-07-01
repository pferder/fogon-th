import pydub
import os

def partition_playlist(playlist, output_playlist, parts_output, seg_len):
    with open(playlist, 'r') as f:
        paths = f.readlines()

    total_playlist = []
    with open(output_playlist, 'w') as op:
        start_time = 0
        for p in paths:
            seg = pydub.AudioSegment.from_file(
                p.strip()
            )
            acum_len = 0
            total_len = len(seg)
            c = 0
            while acum_len < total_len:
                n_seg = seg[seg_len * c : seg_len * (c+1)]
                n_path = os.path.join(
                    parts_output, 
                    '{}_{}'.format(c, os.path.splitext(os.path.basename(p))[0])
                )
                n_seg.export(n_path + '.mp3', format='mp3')
                op.write(os.path.join('music', n_path) + ',' + str(start_time) + '\n')
                dur = len(n_seg)
                acum_len += dur
                start_time += dur
                c += 1
