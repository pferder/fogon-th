import requests

with open('links.txt') as f:
    l = f.readline()

pos_template = 'x{}-y{}-z{}'
template = l.split('=')[0] + '=' + pos_template
d_range = list(range(0, 17))

for x in d_range:
    for y in d_range:
        for z in d_range:
            print(pos_template.format(x, y, z))
            r = requests.get(template.format(x, y, z))
            if r.status_code != 200:
                print((pos_template + ' return code: {}').format(
                    x, y, z, r.status_code))
            else:
                with open(pos_template.format(x, y, z) + '.jpg', 'wb') as f:
                    f.write(r.content)
