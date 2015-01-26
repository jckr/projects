import random

outcomes = {}

def die():
	return random.randint(1, 6)

def dice():
	return die() + die()

mode = False
point = 0
def play():
	global outcomes
	global mode
	global point
	outcome = 0
	roll = dice()
	if mode:
		if roll == point:
			outcome = -1
			mode = False
		else:
		 	if roll == 7:
		 		outcome = 1
		 		mode = False
		 	else: 
		 		outcome = 0
	else:
		if roll in (7,11):
			outcome = -1
		else:
			if roll in (2, 3, 12):
				outcome = 1
				if roll == 12: 
					outcome = 0
			else:
				mode = True
				point = roll

	if outcome not in outcomes:
		outcomes[outcome] = 0
	outcomes[outcome] = outcomes[outcome] + 1

plays = 10000000
debug = False
for i in range(plays):
	play()

print outcomes

### {0: 7118768, 1: 1420668, -1: 1460564}