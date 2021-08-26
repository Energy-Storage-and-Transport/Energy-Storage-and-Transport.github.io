from PIL import Image
import os, sys

scriptdir = os.path.dirname(__file__)
mapdir    = os.path.join(scriptdir,'../assets/map')
levels    = 3

if os.path.exists(mapdir):
    sys.exit('Map folder already exists. Delete it manually to rerun this script.')
else:
    os.mkdir(mapdir)

# load the images
images = []
for level in range(levels):
    if os.path.exists(os.path.join(scriptdir,'map{}.png'.format(level))):
        im = Image.open(os.path.join(scriptdir,'map{}.png'.format(level)))
    images.append(im)

for level, im in enumerate(images):

    # create the level directory
    leveldir = os.path.join(mapdir,str(level))
    os.mkdir(leveldir)

    width  = im.width // 2**level
    height = im.height // 2**level

    for i in range(2**level):
        idir = os.path.join(leveldir,str(i))
        os.mkdir(idir)
        for j in range(2**level):
            im_crop = im.crop((i*width,j*height,(i+1)*width,(j+1)*height)).resize((im.width // 2**(levels-1), im.height // 2**(levels-1)))
            im_crop.save(os.path.join(idir,'{}.png'.format(j)))
