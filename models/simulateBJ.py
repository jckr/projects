import random
color = (2,3,4,5,6,7,8,9,10,10,10,10,'A')
deck = color * 4
stack = deck * 8 + ('r', )


cards = random.sample(stack, len(stack))
debug = True

def getCard():
  global cards
  myCard = cards.pop()
  if myCard == 'r':
    cards = random.sample(stack, len(stack))
    return getCard()
  return myCard

outcomes = {}


def play():
	dealer = (getCard(), getCard())
	player = (getCard(), getCard())
	totals = [0]
	blackJacks = [False]
	bet = 1
	outcome = 0
	playerSoft = False
	playerTotal = 0
	hand1 = ()
	hand2 = ()

	for card in player:
		if card == 'A':
			playerTotal = playerTotal + 11
			playerSoft = True
		else:
			playerTotal = playerTotal + card

	if (player in ((2, 2), (3,3), (7,7)) and dealer[0] in (2,3,4,5,6,7)) or \
	(player == (4,4) and dealer[0] in (5,6)) or \
	(player == (6,6) and dealer[0] in (2,3,4,5,6)) or \
	(player == (9,9) and dealer[0] in (2,3,4,5,6,8,9)) or \
	(player in ((8,8), ('A', 'A'))):
		### split ###
		totals = [0,0]
		blackJacks = [False, False]
		hand1 = (player[0], getCard())
		hand2 = (player[1], getCard())
		if hand1 in (('A', 10), (10, 'A')): 
			blackJacks[0] = True
		if hand2 in (('A', 10), (10, 'A')): 
			blackJacks[1] = True
		while shouldHit(hand1, dealer[0]):
			hand1 = hand1 + (getCard(),)
		totals[0] = (getTotal(hand1))
		while shouldHit(hand2, dealer[0]):
			hand2 = hand2 + (getCard(),)
		totals[1] = (getTotal(hand2))
	else:
		if playerSoft:
			if (playerTotal in (17,18) and dealer[0] in (3,4,5,6)) or \
			(playerTotal in (15,16) and dealer[0] in (4,5,6)) or \
			(playerTotal in (13,14) and dealer[0] in (5,6)):
				### soft double down ###
				bet = 2
				player = player + (getCard(),)
				if player[2] == 'A':
					playerTotal = playerTotal + 1
				else:
					playerTotal = playerTotal + player[2]
				if playerTotal > 21:
					playerTotal = playerTotal - 10
				totals = [playerTotal]
			else:
				if (playerTotal > 18 or (playerTotal == 18 and dealer[0] in (2,7,8))):
					### stand ###
					if (playerTotal == 21):
						blackJacks = [True]
					totals = [playerTotal]
				else:
					### hit (possibly multiple times) ###
					while shouldHit(player, dealer[0]):
						player = player + (getCard(),)
					totals = [getTotal(player)]
		else:
			if (playerTotal == 11 and dealer[0] != 'A') or \
			(playerTotal == 10 and dealer[0] not in ('A', 10)) or \
			(playerTotal == 9 and dealer[0] in (3,4,5,6)):
				### hard double down ###
				bet = 2
				player = player + (getCard(),)
				if player[2] == 'A':
					if (playerTotal + 11) < 22: 
						playerTotal = playerTotal + 11
					else:
						playerTotal = playerTotal + 1
				else:
					playerTotal = playerTotal + player[2]
				totals = [playerTotal]
			else:
				if (playerTotal > 16) or \
				(playerTotal == 16 and dealer[0] not in (7,8)) or \
				(playerTotal == 15 and dealer[0] not in (7,8,9,'A')) or \
				(playerTotal in (13, 14) and dealer[0] in (2,3,4,5,6)) or \
				(playerTotal == 12 and dealer[0] in (4,5,6)):
					### stand ###
					totals = [playerTotal]
				else:
					### hit (possibly multiple times) ###
					while shouldHit(player, dealer[0]):
						player = player + (getCard(),)
					totals = [getTotal(player)]

	### now - evaluate

	countDealer = False
	dealerTotal = getTotal(dealer)
	for i in range(len(totals)):
		total = totals[i]
		if (total < 22):
			countDealer = True

	if countDealer == False:
		if debug:
			print "player hands over 21"
		outcome = -bet * len(totals)
	else:
		### now playing the dealer's hand ###
		while getTotal(dealer) < 17:
			dealer = dealer + (getCard(),)
		dealerTotal = getTotal(dealer)
		dealerBlackJack = dealer in (('A', 10), (10, 'A'))

		for i in range(len(totals)):
			total = totals[i]
			if (total < 22):
				if (dealerTotal < total or dealerTotal > 21):
					### won ###
					outcome = outcome + bet
					if (blackJacks[i]):
						outcome = outcome + .5 * bet
				if (dealerTotal > total and dealerTotal < 22):
					### lost ### 
					outcome = outcome - bet
				if (total < 22 and total == dealerTotal):
					### tie? ###
					if dealerBlackJack:
						if blackJacks[i]: 
							### push ###
							outcome = outcome
						else:
							### dealer black jack wins ###
							outcome = outcome - bet
					else:
						if blackJacks[i]:
							### player black jack wins ###
							outcome = outcome + 1.5 * bet
						else:
							### push ###
							outcome = outcome
			else:
				outcome = outcome - bet

	if outcome not in outcomes:
		outcomes[outcome] = 0
	outcomes[outcome] = outcomes[outcome] + 1

	if debug:
		print player, getTotal(player)
		if len(totals)>1:
			print hand1, totals[0]
			print hand2, totals[1]
		print dealer, dealerTotal
		print outcome





def getTotal(hand):
	soft = False
	total = 0
	
	for card in hand:
		if card == 'A':
			if (total + 11 < 22): 
				total = total + 11
				soft = True
			else:
				total = total + 1
		else:
			total = total + card

	if soft and total > 21:
		total = total - 10
		soft = False

	return total


def shouldHit(hand, dealerCard):
	soft = False
	total = 0
	
	for card in hand:
		if card == 'A':
			if (total + 11 < 22): 
				total = total + 11
				soft = True
			else:
				total = total + 1
		else:
			total = total + card

	if soft and total > 21:
		total = total - 10
		soft = False

	if total > 18: 
		return False
	if soft:
		if total == 18 and dealerCard in (9, 10, 'A'):
			return False
		else:
			return True
	else:
		if total > 16:
			return False
		if total > 12:
			if dealerCard in (2,3,4,5,6):
				return False
			else:
				return True
		if total == 12:
			if dealerCard in (4,5,6):
				return False
		return True


plays = 10000000
debug = False
for i in range(plays):
	play()

###
###  -2:   456294  456175
###  -1:  4348224 4349438
###   0:   853928  853924
### 0.5:     9434    9462
###   1:  3256897 3256359
### 1.5:   454194  454977
###   2:   604133  602803
### 2.5:    11795   11734
###   3:     5101    5128

print outcomes
