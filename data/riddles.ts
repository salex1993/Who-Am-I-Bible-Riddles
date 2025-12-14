import { LocalRiddle } from '../types';

const RAW_CSV = `RiddleNumber,Set,Category,DifficultyLevel,DifficultyLabel,DifficultyFull,QuestionType,RiddleText,Answer
1,Main,Patriarchs & Matriarchs,1.0,Easy,Level 1 – Easy,Who am I?,"I was the child of promise long delayed,
On an altar of wood I once was laid.
My father raised the knife at God’s command,
Till heaven’s voice stopped his trembling hand.
My name means “laughter,” joy hard-won,
I carried the covenant as Abraham’s son.
Who am I?",Isaac
2,Main,Patriarchs & Matriarchs,2.0,Intermediate,Level 2 – Intermediate,Who am I?,"At a well I showed a stranger grace,
Watering his camels in that dusty place.
I left my home at my family’s word,
To wed a man whom I’d scarcely heard.
Two nations struggled deep inside of me,
I favored the younger in destiny.
Who am I?",Rebekah
3,Main,Patriarchs & Matriarchs,3.0,Challenging,Level 3 – Challenging,Who am I?,"My sister’s beauty won my groom,
Yet in the night I left the room.
Unloved, unseen, I bore him sons,
While her affection seemed to “won.”
From my womb came priesthood and the kingly line,
Judah and Levi were children of mine.
Who am I?",Leah
4,Main,Patriarchs & Matriarchs,2.0,Intermediate,Level 2 – Intermediate,Who am I?,"He served long years to win my hand,
I was the joy of his promised land.
I envied children I did not bear,
Till God remembered my desperate prayer.
I stole the idols my father prized,
And died on the road where my child first cried.
Who am I?",Rachel
5,Main,Patriarchs & Matriarchs,3.0,Challenging,Level 3 – Challenging,Who am I?,"I chose the plain that looked so fair,
A fertile valley I thought was rare.
Yet wicked cities stained that ground,
And fire from heaven soon came down.
My wife looked back and turned to stone,
I escaped in caves, afraid, alone.
Who am I?",Lot
6,Main,Patriarchs & Matriarchs,4.0,Difficult,Level 4 – Difficult,Who am I?,"Blameless I sat in the ashes and dust,
Losing my wealth, my children, my trust.
Friends spoke long, but brought little light,
I questioned God in my grief and night.
Yet when He answered out of the storm,
I bowed in worship, my heart transformed.
Who am I?",Job
7,Main,Patriarchs & Matriarchs,5.0,Very Difficult,Level 5 – Very Difficult,Who am I?,"I met a wanderer returning from war,
Bread and wine from my table he saw.
As priest and king in one strange role,
I blessed the man whom God would extol.
No father or mother recorded for me,
My name hints at righteousness and royalty.
Who am I?",Melchizedek
8,Main,Prophets & Seers,4.0,Difficult,Level 4 – Difficult,Who am I?,"My marriage became a living sign,
Of covenant love that still would bind.
I took back one who’d wandered far,
To show God’s heart, His jealous scar.
I spoke of knowledge and kindness true,
And “not My people” made new in view.
Who am I?",Hosea
9,Main,Prophets & Seers,3.0,Challenging,Level 3 – Challenging,Who am I?,"I spoke of locusts dark as night,
Yet promised afterward Spirit and light.
Your sons and daughters would prophesy,
Old men dream and young men try.
The day of the Lord I proclaimed with fear,
Yet rivers of restoration drew near.
Who am I?",Joel
10,Main,Prophets & Seers,2.0,Intermediate,Level 2 – Intermediate,Who am I?,"In a small town my voice was heard,
I asked what God from man preferred.
Not empty rites or outward show,
But justice, mercy, and humbleness low.
I named the place where a Ruler would rise,
From Bethlehem, in humble disguise.
Who am I?",Micah
11,Main,Prophets & Seers,4.0,Difficult,Level 4 – Difficult,Who am I?,"I stood on my watch to question the Lord,
Why evil prospers and swings the sword.
He answered me, “The righteous live by faith,”
Though nations rage and sharpen their wraith.
I trembled at fig trees bare and stall,
Yet rejoiced in God, my strength, my all.
Who am I?",Habakkuk
12,Main,Prophets & Seers,5.0,Very Difficult,Level 5 – Very Difficult,Who am I?,"With paneled houses you lined your walls,
Yet left God’s dwelling as ruined halls.
I urged you, “Consider your ways, repent,”
So blessing, not drought, would be heaven-sent.
In little time the temple rose again,
As you obeyed the word I gave men.
Who am I?",Haggai
13,Main,Prophets & Seers,3.0,Challenging,Level 3 – Challenging,Who am I?,"A vision of lampstand and olive tree,
A branch and a stone were shown to me.
I saw a priest with garments defiled,
Cleansed by the Lord and made reconciled.
“Not by might,” I heard God say,
“But by My Spirit” you’ll build My way.
Who am I?",Zechariah
14,Main,Prophets & Seers,2.0,Intermediate,Level 2 – Intermediate,Who am I?,"My scroll is short and closes the line,
Between old covenant and newborn sign.
I spoke of a messenger, blazing and bright,
To prepare the way before the Light.
I warned of hearts grown cold and hard,
Yet promised a sun of healing reward.
Who am I?",Malachi
15,Main,Kings & Rulers,3.0,Challenging,Level 3 – Challenging,Who am I?,"When death drew near, I turned my face,
Wept to the Lord for added grace.
The sun moved back upon the stair,
As God gave years in answer to prayer.
I once spread a letter before His throne,
And watched an army fall by Him alone.
Who am I?",Hezekiah
16,Main,Kings & Rulers,4.0,Difficult,Level 4 – Difficult,Who am I?,"When enemies rose, I sought God first,
Fearing the armies that threatened our burst.
I sent singers ahead with praise on their lips,
And watched confusion destroy their ships.
Yet later I tangled in alliances wrong,
A warning that trust must in God be strong.
Who am I?",Jehoshaphat
17,Main,Kings & Rulers,3.0,Challenging,Level 3 – Challenging,Who am I?,"I listened to youth and ignored the old,
So Israel’s strength was split and sold.
“Make our burden light,” they pled that day,
But I made the yoke still harder to sway.
Ten tribes rebelled and walked away,
Leaving me with Judah and leftover sway.
Who am I?",Rehoboam
18,Main,Kings & Rulers,4.0,Difficult,Level 4 – Difficult,Who am I?,"I forged two calves of glittering gold,
“Here are your gods,” my people were told.
I changed the feasts and the priests in haste,
So northern hearts in falsehood were placed.
My name became a proverb of sin,
A pattern many would follow within.
Who am I?",Jeroboam
19,Main,Kings & Rulers,2.0,Intermediate,Level 2 – Intermediate,Who am I?,"I dreamed of statues, beasts, and fire,
My pride grew tall like a tower higher.
A furnace blazed against those three,
Yet One like a son of gods walked free.
I ate like cattle, wet with dew,
Till I confessed heaven’s rule was true.
Who am I?",Nebuchadnezzar
20,Main,Kings & Rulers,3.0,Challenging,Level 3 – Challenging,Who am I?,"I did not know the God you praised,
Yet by His name my spirit was raised.
I loosed a people to rebuild their walls,
And funded the work from my royal halls.
Named long before I drew my breath,
I freed exiles from their foreign death.
Who am I?",Cyrus of Persia
21,Main,Kings & Rulers,2.0,Intermediate,Level 2 – Intermediate,Who am I?,"I feared a child the prophets foretold,
So I shed young blood in terror cold.
I built great stones and ruled with might,
Yet trembled at whispers of heavenly light.
When wise men left by a different way,
My name was shadow over that day.
Who am I?",Herod the Great
22,Main,Women of the Bible,1.0,Easy,Level 1 – Easy,Who am I?,"Seven dark spirits once troubled my soul,
Till His gentle word made my spirit whole.
I followed Him closely, through cross and tomb,
Wept in the garden of grief and gloom.
I heard my name in the morning air,
First to proclaim, “He is not there!”
Who am I?",Mary Magdalene
23,Main,Women of the Bible,1.0,Easy,Level 1 – Easy,Who am I?,"I hurried to serve when guests drew near,
My hands were busy, my mind sincere.
Yet I complained when my sister stayed,
At the Teacher’s feet while I worked and prayed.
He gently showed what mattered most—
His word, His presence, more than the host.
Who am I?",Martha
24,Main,Women of the Bible,3.0,Challenging,Level 3 – Challenging,Who am I?,"With my husband I taught in our humble home,
Explaining the Way to those who’d roam.
We corrected a preacher, gifted, bright,
And led him deeper in Gospel light.
Tentmaker hands and open door,
We worked with Paul the Lord to adore.
Who am I?",Priscilla
25,Main,Women of the Bible,4.0,Difficult,Level 4 – Difficult,Who am I?,"I carried a letter across the sea,
Commended as servant to all who’d see.
In a seaside church I served with grace,
My name in Romans holds honored place.
Deacon, helper, steadfast friend,
I used my status the saints to defend.
Who am I?",Phoebe
26,Main,Women of the Bible,3.0,Challenging,Level 3 – Challenging,Who am I?,"I sewed for widows, garments neat,
My kindness clothed the poor in street.
When sickness struck and I drew still,
Their tears rose up like incense spill.
An apostle prayed, I rose once more,
And many believed the Lord they saw.
Who am I?",Dorcas / Tabitha
27,Main,Women of the Bible,4.0,Difficult,Level 4 – Difficult,Who am I?,"In famine’s land I shared my bread,
With prophet guest whom God had led.
My flour and oil did not run dry,
Though drought and hunger stalked the sky.
I wept when death took my son’s breath,
Till prayer returned him from the death.
Who am I?",The widow of Zarephath
28,Main,Women of the Bible,5.0,Very Difficult,Level 5 – Very Difficult,Who am I?,"I built an upper room on my roof,
For holy visits, quiet proof.
A promised child I later bore,
Yet grief came knocking at my door.
I clung to the man through field and hill,
Till staff and prayer revived him still.
Who am I?",The Shunammite woman
29,Main,Women of the Bible,4.0,Difficult,Level 4 – Difficult,Who am I?,"My daughter learned the sacred page,
From me and my mother in a distant age.
A young coworker of Paul so dear,
Carried our faith without any fear.
His letters name the two of us,
As quiet roots of his bold trust.
Who am I?",Lois – Timothy’s grandmother
30,Main,Judges & Deliverers,4.0,Difficult,Level 4 – Difficult,Who am I?,"With hidden blade on my right-bound thigh,
I came to meet a ruler high.
His swollen frame and guarded room,
Could not protect from sudden doom.
I slipped away while confusion spread,
And Israel rose when their foe lay dead.
Who am I?",Ehud
31,Main,Judges & Deliverers,5.0,Very Difficult,Level 5 – Very Difficult,Who am I?,"First of the judges after the strife,
A lion of God with battle life.
I conquered foes and won a bride,
God’s Spirit on my sword and stride.
My name appears, yet tales are brief,
A quiet flame of Israel’s relief.
Who am I?",Othniel
32,Main,Judges & Deliverers,3.0,Challenging,Level 3 – Challenging,Who am I?,"I trembled to go though victory was sure,
A woman’s glory my heart would endure.
A prophetess spoke and I obeyed,
We marched together while Sisera stayed.
Though I led troops on that battlefield,
Another’s tent peg won the final yield.
Who am I?",Barak
33,Main,Judges & Deliverers,3.0,Challenging,Level 3 – Challenging,Who am I?,"My hand held milk and simple fare,
Yet war’s commander met me there.
He slept in trust beneath my tent,
From battle’s chariots battered and spent.
With steady stroke I struck him through,
And Israel sang of what I’d do.
Who am I?",Jael
34,Main,Judges & Deliverers,2.0,Intermediate,Level 2 – Intermediate,Who am I?,"Along with Joshua I spied the land,
Grapes on a pole in my weary hand.
Though giants stood where cities rose,
I trusted more the God we chose.
In later years, both strong and old,
I claimed my mountain with courage bold.
Who am I?",Caleb
35,Main,Judges & Deliverers,2.0,Intermediate,Level 2 – Intermediate,Who am I?,"A wealthy farmer in Bethlehem’s field,
I watched a foreign widow glean her yield.
Her kindness and loyalty caught my eye,
A nearer kinsman passed her by.
I redeemed her lot and took her name,
Our child would lead to David’s fame.
Who am I?",Boaz
36,Main,Apostles & Early Church,2.0,Intermediate,Level 2 – Intermediate,Who am I?,"I left my nets at my brother’s side,
The sons of thunder in Galilee’s tide.
I first drank death from Herod’s sword,
A martyr early for my Lord.
Not the writer of later pages,
But one whose life burned bright in ages.
Who am I?",James son of Zebedee
37,Main,Apostles & Early Church,3.0,Challenging,Level 3 – Challenging,Who am I?,"I once thought my Brother out of His mind,
Yet later I called Him Lord, divine.
I led the church in its holy fight,
Ruling on Gentiles and freedom’s right.
My letter speaks of works and creed,
Alive as proof of living seed.
Who am I?","James, the Lord’s brother"
38,Main,Apostles & Early Church,3.0,Challenging,Level 3 – Challenging,Who am I?,"Under a fig tree I sat alone,
Till One unveiled what was unknown.
I doubted if good from Nazareth came,
But quickly confessed His royal name.
Some call me by a different sound,
A twin of names in Gospel ground.
Who am I?",Bartholomew / Nathanael
39,Main,Apostles & Early Church,3.0,Challenging,Level 3 – Challenging,Who am I?,"“Son of encouragement” was my call,
I sold my land and gave it all.
I vouched for one the church still feared,
When former hatred had not yet cleared.
With Mark and Paul I walked some miles,
Though sharp disputes split paths and styles.
Who am I?",Barnabas
40,Main,Apostles & Early Church,4.0,Difficult,Level 4 – Difficult,Who am I?,"In prison cells I sang at night,
Chains fell off in sudden light.
I traveled with Paul from town to town,
Bearing the message of cross and crown.
At one time I stayed when he moved on,
Strengthening churches till day was done.
Who am I?",Silas
41,Main,Apostles & Early Church,2.0,Intermediate,Level 2 – Intermediate,Who am I?,"My tears and fears the apostle knew,
A “true son” in the Gospel view.
I learned from Lois and Eunice first,
Then walked with Paul in zeal and thirst.
Two letters bear my timid name,
Encouraged to fan my gift to flame.
Who am I?",Timothy
42,Main,Apostles & Early Church,3.0,Challenging,Level 3 – Challenging,Who am I?,"I ordered churches on island shore,
Appointing elders and teaching more.
Grace and good works I held as one,
Fruit of faith in God’s dear Son.
A trusted friend in mission’s strife,
My name heads a letter on holy life.
Who am I?",Titus
43,Main,Apostles & Early Church,4.0,Difficult,Level 4 – Difficult,Who am I?,"Mighty in Scriptures and eloquent speech,
I knew the truth but not in reach.
Two quiet tentmakers drew me aside,
Explained the Way with fuller guide.
I watered where another sowed,
In Corinth’s growing, fragile load.
Who am I?",Apollos
44,Main,Gentiles & Foreigners,2.0,Intermediate,Level 2 – Intermediate,Who am I?,"I carried leprosy in my skin,
A Syrian captain hardened within.
A captured girl spoke of a seer,
Whose God could cleanse my shame and fear.
I dipped in waters I once despised,
And left with flesh like a child, surprised.
Who am I?",Naaman
45,Main,Gentiles & Foreigners,3.0,Challenging,Level 3 – Challenging,Who am I?,"I feared God though I wore Roman mail,
My prayers and gifts rose like a trail.
An angel spoke of a vision came,
And called for one who knew Christ’s name.
As Spirit fell on my household there,
The nations’ doors swung wide with prayer.
Who am I?",Cornelius
46,Main,Gentiles & Foreigners,4.0,Difficult,Level 4 – Difficult,Who am I?,"I pled for crumbs beneath the board,
For my tormented child before the Lord.
Called a dog by covenant line,
I clung to mercy still divine.
He praised my faith, though I stood outside,
And healed my daughter far and wide.
Who am I?",The Syrophoenician woman
47,Main,Gentiles & Foreigners,3.0,Challenging,Level 3 – Challenging,Who am I?,"I asked a Teacher to only speak,
For distance made no healing weak.
My servant lay in painful strife,
Yet I saw in Him commanding life.
I said I was unworthy of His stay,
And marveled Him with my faith that day.
Who am I?",The centurion of Capernaum
48,Main,Gentiles & Foreigners,3.0,Challenging,Level 3 – Challenging,Who am I?,"I hardened my heart through plague and plea,
Though rivers bled and frogs ran free.
Darkness fell and hailstones crashed,
Yet I held fast till hope was dashed.
One final night took firstborn breath,
And I watched a sea become my death.
Who am I?",The Pharaoh of the Exodus
49,Main,Gentiles & Foreigners,2.0,Intermediate,Level 2 – Intermediate,Who am I?,"I washed my hands before the crowd,
Yet signed a sentence shouted loud.
I questioned, “What is truth?” that day,
While Truth stood bound a breath away.
A governor trapped by fear and fame,
I sent Him to cross, though finding no blame.
Who am I?",Pontius Pilate
50,Main,Gentiles & Foreigners,2.0,Intermediate,Level 2 – Intermediate,Who are we?,"We watched the heavens for signs of light,
A star arose in eastern night.
We journeyed far with treasures three,
To honor a Child of prophecy.
Though kings in art, just seekers wise,
We knelt in worship before His eyes.
Who are we?",The Magi / Wise Men
51,Main,Angels & Heavenly Beings,1.0,Easy,Level 1 – Easy,Who am I?,"I stood in the temple, shining bright,
Telling a priest of his son in sight.
I named the child before his birth,
Who’d point the way to heav’nly worth.
I later spoke of a Virgin’s Son,
Announcing the Savior, the Holy One.
Who am I?",Gabriel
52,Main,Angels & Heavenly Beings,2.0,Intermediate,Level 2 – Intermediate,Who am I?,"I contended for Moses’ hidden grave,
Resisting the Accuser who sought to enslave.
My voice will shout when dead ones rise,
At trumpet sound across the skies.
I’m named as prince of Israel’s band,
A warrior over a promised land.
Who am I?",Michael the archangel
53,Main,Angels & Heavenly Beings,3.0,Challenging,Level 3 – Challenging,Who am I?,"A flaming sword I held in hand,
To guard the way to Eden’s land.
No mortal feet could pass my flame,
Once sin had spread and ruined the frame.
I stand between what once was pure,
And paradise no longer sure.
Who am I?",The cherub at Eden / Cherubim
54,Main,Angels & Heavenly Beings,4.0,Difficult,Level 4 – Difficult,Who am I?,"With sixfold wings I veiled my face,
Crying “Holy!” in that place.
Coals from the altar touched a tongue,
Cleansing a prophet, fearful, young.
Around the throne I ceaseless sing,
Of glory of the Lord, the King.
Who am I?",A seraph / Seraphim
55,Main,Angels & Heavenly Beings,3.0,Challenging,Level 3 – Challenging,Who am I?,"I wrestled a man till break of day,
Yet left him limping on his way.
He clung to me for word and name,
And from that night, he was not the same.
Though mystery veiled my shining sword,
He said, “I’ve seen the face of the Lord.”
Who am I?",The mysterious man/angel who wrestled Jacob
56,Main,Angels & Heavenly Beings,4.0,Difficult,Level 4 – Difficult,Who are we?,"My chariots circled the mountain rim,
Though only one servant saw us dim.
His eyes were opened by prophet’s plea,
To glimpse the host that fought for the free.
We stood in fire, unseen by most,
An unseen, flame-wreathed, guarding host.
Who are we?",The heavenly army around Elisha / angelic host
57,Main,Angels & Heavenly Beings,2.0,Intermediate,Level 2 – Intermediate,Who am I?,"I shut the mouths of lions’ jaws,
When prayerful faith obeyed God’s laws.
I joined three men in burning heat,
Yet left no scorch upon their feet.
Sent to protect at God’s command,
I serve unseen at His right hand.
Who am I?",An angelic deliverer in Daniel – generic angel of protection
58,Main,Angels & Heavenly Beings,3.0,Challenging,Level 3 – Challenging,Who am I?,"I rolled the stone from a borrowed grave,
To show the world He’d risen to save.
My clothes flashed bright like lightning’s flare,
And guards fell trembling in their fear.
I said, “He’s risen, do not dread,”
To those who sought the living among the dead.
Who am I?",The angel at Jesus’ tomb
59,Main,Angels & Heavenly Beings,5.0,Very Difficult,Level 5 – Very Difficult,Who am I?,"Four faces stare—ox, eagle, man, and lion,
Wings and wheels with fire undying.
I bear the throne of One above,
A moving chariot of holy love.
In visions strange I’m often seen,
In temple, river, and glory sheen.
Who am I?",The living creatures of Ezekiel’s vision / cherubim in Ezekiel 1
60,Main,Angels & Heavenly Beings,5.0,Very Difficult,Level 5 – Very Difficult,Who are we?,"I cry “Holy” day and night,
Around the throne arrayed in light.
Full of eyes, yet never bored,
We fall before the sovereign Lord.
Lion, calf, and human face,
And soaring eagle in our place.
Who are we?",The four living creatures in Revelation
61,Main,Angels & Heavenly Beings,4.0,Difficult,Level 4 – Difficult,Who am I?,"I struck a king with sudden blow,
When pride and praise began to grow.
He took God’s glory as his own,
And worms shared in his borrowed throne.
My blow was swift, my mission brief,
A judgment sent on crowned belief.
Who am I?",The angel who struck Herod Agrippa I – Acts 12
62,Main,Angels & Heavenly Beings,3.0,Challenging,Level 3 – Challenging,Who am I?,"I stood before a donkey’s path,
Sword drawn out in holy wrath.
Its stubborn halt seemed strange and wild,
Till opened eyes revealed God’s child.
I turned a curse to blessing word,
By blocking one who would be heard.
Who am I?",The angel who opposed Balaam
63,Main,Angels & Heavenly Beings,2.0,Intermediate,Level 2 – Intermediate,Who are we?,"We sang at night in shepherds’ field,
When heaven’s plan was first revealed.
“Peace on earth,” our anthem rang,
As over Bethlehem, we sang.
Glory’s light around us shone,
Announcing God’s incarnate Son.
Who are we?",The angelic host at Christ’s birth
64,Main,Angels & Heavenly Beings,4.0,Difficult,Level 4 – Difficult,Who am I?,"I stand with book in lifted hand,
One foot on sea, one on the land.
A rainbow crowns my fearsome brow,
Thunder answers to my vow.
I swear by Him who lives and reigns,
That mystery nears its final strains.
Who am I?",The mighty angel of Revelation 10
65,Main,Angels & Heavenly Beings,5.0,Very Difficult,Level 5 – Very Difficult,Who are we?,"Crowns upon our heads we cast,
Before the One whose reign will last.
Robes of white and thrones in ring,
We watch the worship that angels sing.
Twelve and twelve in circle wide,
We witness Bridegroom and His bride.
Who are we?",The twenty-four elders in Revelation
66,Main,Enemies & Villains,1.0,Easy,Level 1 – Easy,Who am I?,"I towered tall with spear and shield,
No man of Israel dared the field.
A shepherd boy brought stones and sling,
And cut me down before the King.
My boastful words now echo grim,
A warning not to mock His whim.
Who am I?",Goliath
67,Main,Enemies & Villains,1.0,Easy,Level 1 – Easy,Who am I?,"I spoke through scales and subtle lies,
Twisting truth before their eyes.
One question turned their hearts away,
From trust in God to doubt that day.
Through my deceit death entered in,
And all creation groaned with sin.
Who am I?",The serpent in Eden
68,Main,Enemies & Villains,2.0,Intermediate,Level 2 – Intermediate,Who am I?,"I painted eyes and plotted schemes,
Killed a man to keep my dreams.
I hunted prophets, broke God’s law,
And stirred my husband with wicked jaw.
My name now stands for crafty guile,
A queen of sin with painted smile.
Who am I?",Jezebel
69,Main,Enemies & Villains,2.0,Intermediate,Level 2 – Intermediate,Who am I?,"I hired a prophet to curse a race,
Afraid they’d swarm and take my place.
From mountain tops I watched below,
Yet blessing, not curse, was all he’d show.
I later fell by Israel’s hand,
A king undone before his land.
Who am I?","Balak, king of Moab"
70,Main,Enemies & Villains,3.0,Challenging,Level 3 – Challenging,Who am I?,"I loved reward more than the right,
And could not see the angel’s sight.
My beast rebuked my blinded will,
Yet later, counsel led to ill.
Though blessing crossed my lips that day,
My secret guidance led astray.
Who am I?",Balaam
71,Main,Enemies & Villains,2.0,Intermediate,Level 2 – Intermediate,Who am I?,"I plotted death for a scattered race,
Offended by one who hid his face.
Gallows I built to lift him high,
But on them, I myself would die.
A law I sealed seemed fixed and grim,
Till God overturned my fate, not him.
Who am I?",Haman
72,Main,Enemies & Villains,3.0,Challenging,Level 3 – Challenging,Who am I?,"With Tobiah’s sneers I tried to break,
A wall of stones for Zion’s sake.
I mocked their strength, I mocked their God,
And summoned threats with scoffing nod.
Yet walls rose up despite my rage,
And left my name on failure’s page.
Who am I?",Sanballat
73,Main,Enemies & Villains,3.0,Challenging,Level 3 – Challenging,Who am I?,"I stopped no sword but blocked the heart,
Love of first place my poisoned start.
I pushed out brothers, shut the door,
And would not help the traveling poor.
In letter brief my name appears,
A warning tale for later years.
Who am I?",Diotrephes
74,Main,Enemies & Villains,4.0,Difficult,Level 4 – Difficult,Who am I?,"I sought to turn a ruler’s ear,
From Gospel truth I would not hear.
A child of devil I was named,
And struck with blindness, weak and shamed.
My magic arts could not withstand,
The Lord I tried to countermand.
Who am I?",Elymas / Bar-Jesus
75,Main,Enemies & Villains,4.0,Difficult,Level 4 – Difficult,Who am I?,"I bought a field with bloody pay,
And fell headlong one broken day.
Before that fall I led the band,
To seize my Lord with torch in hand.
My kiss betrayed the sinless One,
A tragic end for a chosen son.
Who am I?",Judas Iscariot – focusing on his end
76,Main,Enemies & Villains,3.0,Challenging,Level 3 – Challenging,Who am I?,"I tested Him with twisted scroll,
Quoting truth without a soul.
Stones to bread and kingdoms wide,
I offered all in prideful stride.
He sent me off with written word,
And crushed my lies with what He heard.
Who am I?",Satan in the wilderness temptation
77,Main,Enemies & Villains,5.0,Very Difficult,Level 5 – Very Difficult,Who am I?,"I carry names from age to age,
Beast, dragon, liar, accuser of sage.
I fell from heaven with stars in tow,
And wage my war on saints below.
Yet destined am I for fiery chain,
When Lamb and King forever reign.
Who am I?",The dragon / Satan in Revelation
78,Main,Enemies & Villains,4.0,Difficult,Level 4 – Difficult,Who am I?,"I rose against my father’s throne,
My beauty praised, my pride full-grown.
I stole hearts with flattering word,
Till battle’s end left justice heard.
Caught by branches overhead,
I hung between the living and dead.
Who am I?",Absalom
79,Main,Enemies & Villains,4.0,Difficult,Level 4 – Difficult,Who am I?,"I lied to God for glory’s sake,
Pretending gifts I did not make.
Beside my wife I held back part,
While claiming the whole with pious heart.
Feet at the door foretold my fate,
As judgment came swift and late.
Who am I?",Ananias – of Ananias & Sapphira
80,Main,Enemies & Villains,5.0,Very Difficult,Level 5 – Very Difficult,Who am I?,"I sat in synagogue seat of old,
Honored in prayers and garments bold.
Yet widows’ houses fed my greed,
While I ignored the weightier need.
My name is many, not just one,
A mask of hearts the Lord will shun.
Who am I?",The hypocritical Pharisee / generic religious hypocrite
81,Main,Parables & Symbolic Figures,1.0,Easy,Level 1 – Easy,What am I?,"I fell on path and rocky ground,
Among the thorns and fertile mound.
Sometimes stolen, scorched, or choked,
Sometimes thriving where I’m soaked.
In every heart where truth is heard,
I picture how they treat God’s Word.
What am I?",The seed in the Parable of the Sower
82,Main,Parables & Symbolic Figures,1.0,Easy,Level 1 – Easy,Who am I?,"I cared for one left half as dead,
While others passed on ahead.
Though called an enemy by race,
I showed compassion face to face.
His wounds I bound, his stay I paid,
A living lesson Jesus made.
Who am I?",The Good Samaritan
83,Main,Parables & Symbolic Figures,2.0,Intermediate,Level 2 – Intermediate,Who am I?,"I left my home with squandered heart,
Spent all my wealth in lands apart.
When hunger came and friends were gone,
I dreamed of where I’d once belonged.
My father ran with robe and ring,
To welcome back his wandering thing.
Who am I?",The prodigal son
84,Main,Parables & Symbolic Figures,3.0,Challenging,Level 3 – Challenging,Who am I?,"I stayed at home and did my chore,
Yet jealousy knocked at my door.
I would not join the festive song,
Convinced my brother still was wrong.
The Father stood and pled with me,
Exposing cold hypocrisy.
Who am I?",The elder brother in the prodigal son parable
85,Main,Parables & Symbolic Figures,2.0,Intermediate,Level 2 – Intermediate,What am I?,"Small in hand yet great in tree,
I picture kingdom’s mystery.
Hidden first within the ground,
Till birds find branches safe around.
From least of seeds to shelter wide,
I show how heaven’s truths abide.
What am I?",The mustard seed / tree of the parable
86,Main,Parables & Symbolic Figures,3.0,Challenging,Level 3 – Challenging,Who am I?,"I worked the field at early dawn,
And bore the heat till day was gone.
Yet others came at final hour,
Receiving wage of equal power.
I grumbled at the Master’s pay,
Revealing envy in my way.
Who am I?",A grumbling early laborer in the vineyard parable
87,Main,Parables & Symbolic Figures,2.0,Intermediate,Level 2 – Intermediate,Who am I?,"I searched my house by candle’s light,
For something lost and small from sight.
When I found what once was gone,
I called my friends to celebrate on.
So heaven sings with joyous tone,
When one lost heart returns alone.
Who am I?",The woman with the lost coin
88,Main,Parables & Symbolic Figures,2.0,Intermediate,Level 2 – Intermediate,Who am I?,"I left the ninety-nine behind,
To seek one straying from the line.
Through rough and thorn I climbed and cried,
Till lost was found and by my side.
On shoulders strong I bore him home,
While all rejoiced that he’d not roam.
Who am I?",The shepherd in the lost sheep parable
89,Main,Parables & Symbolic Figures,3.0,Challenging,Level 3 – Challenging,Who am I?,"I stored my grain and built up more,
Planning feasts behind locked door.
I spoke of years of ease and rest,
With no thought for the soul at test.
“Fool,” came the word that sealed my end,
Rich in self but poor in Friend.
Who am I?",The rich fool
90,Main,Parables & Symbolic Figures,4.0,Difficult,Level 4 – Difficult,Who am I?,"I judged no case with fear of God,
Yet wore a widow’s pleas like a rod.
Her constant cry wore down my pride,
Till justice came, though love had died.
I show how faith must persevere,
When heaven seems to close its ear.
Who am I?",The unjust judge
91,Main,Parables & Symbolic Figures,4.0,Difficult,Level 4 – Difficult,Who am I?,"I waited late with lamp in hand,
But brought no oil as reserve at hand.
When cry rang out, “The bridegroom’s near!”
My fading flame betrayed my fear.
Locked outside the wedding gate,
I learned too late the cost of wait.
Who am I?",One of the foolish virgins
92,Main,Parables & Symbolic Figures,3.0,Challenging,Level 3 – Challenging,Who am I?,"I buried what my master gave,
Fearful, cautious, not truly brave.
I called him hard, unjust, severe,
Excusing sloth and hidden fear.
My wasted trust, my empty hand,
Lost all I had in judgment’s land.
Who am I?",The servant who buried his talent
93,Main,Parables & Symbolic Figures,5.0,Very Difficult,Level 5 – Very Difficult,What am I?,"I crept among the wheat at night,
My roots entwined with what looked right.
Though workers wished to pull me fast,
The master let the season last.
At harvest time the sickle knows,
What burns below and what still grows.
What am I?",The tares/weeds among the wheat
94,Main,Parables & Symbolic Figures,4.0,Difficult,Level 4 – Difficult,What am I?,"I hid in dough in measured span,
Working silent, hand to pan.
Till all was raised with unseen might,
I pictured grace in quiet light.
From little start to loaf made whole,
I show how kingdom works in soul.
What am I?",The leaven in the parable
95,Main,Parables & Symbolic Figures,4.0,Difficult,Level 4 – Difficult,Who am I?,"I found a field with treasure deep,
Too rich a prize for casual keep.
I sold my goods with joyful heart,
To own that land and hidden part.
I show the worth of kingdom’s gain,
Beyond all comfort, wealth, or fame.
Who am I?",The man who found treasure in the field
96,Main,Parables & Symbolic Figures,4.0,Difficult,Level 4 – Difficult,Who am I?,"I searched the markets far and near,
For finest gems both bright and clear.
One perfect pearl I chanced to see,
Worth more than all my treasury.
I sold it all to make it mine,
An image of a worth divine.
Who am I?",The merchant in search of fine pearls
97,Main,Parables & Symbolic Figures,5.0,Very Difficult,Level 5 – Very Difficult,What am I?,"I bore no fruit though leaves were fair,
Promising life that wasn’t there.
Spoken against by holy breath,
I withered quickly at His death.
My cursed boughs a lesson give,
Of outward show where truth can’t live.
What am I?",The cursed fig tree as symbolic sign
98,Main,Parables & Symbolic Figures,5.0,Very Difficult,Level 5 – Very Difficult,What am I?,"I’m narrow, hard, and seldom found,
Few walk my steep and rugged ground.
Yet at my end true life is won,
Through One who is the Father’s Son.
Beside me is a wider way,
That many love—but few who stay.
What am I?",The narrow gate / narrow way
99,Main,Parables & Symbolic Figures,5.0,Very Difficult,Level 5 – Very Difficult,Who am I?,"I carried branches, leaves, and fruit,
Abiding in a living root.
Cut from me, you’ll fade and die,
Joined to me, your joy runs high.
My Father prunes each fruitful limb,
That more may grow and glorify Him.
Who am I?",The true vine – Christ’s symbol in John 15
100,Main,Parables & Symbolic Figures,5.0,Very Difficult,Level 5 – Very Difficult,What am I?,"I stand within the shepherd’s land,
Keeping thieves from what He’s planned.
Through me His flock finds pasture sweet,
And safe repose at wounded feet.
I’m both the way and guarding wall,
For all who answer to His call.
What am I?",The door/gate for the sheep – John 10
596,Main,Parables & Symbolic Figures,3.0,Challenging,Level 3 – Challenging,Who am I?,"I wrapped my coin inside a cloth,
Hid it away from profit’s growth.
I feared the man who gave it me,
And lost reward eternally.
Who am I?",The wicked servant with the mina / talent`;

// Simple CSV parser that handles quoted fields with newlines
function parseCSV(text: string): LocalRiddle[] {
  const rows: LocalRiddle[] = [];
  let currentLine: string[] = [];
  let currentVal = '';
  let inQuote = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    if (inQuote) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          currentVal += '"';
          i++;
        } else {
          inQuote = false;
        }
      } else {
        currentVal += char;
      }
    } else {
      if (char === '"') {
        inQuote = true;
      } else if (char === ',') {
        currentLine.push(currentVal.trim());
        currentVal = '';
      } else if (char === '\n') {
        currentLine.push(currentVal.trim());
        if (currentLine.length > 1) { // Skip empty lines
             const r = mapRow(currentLine);
             if (r) rows.push(r);
        }
        currentLine = [];
        currentVal = '';
      } else if (char !== '\r') {
        currentVal += char;
      }
    }
  }
  // Last line
  if (currentLine.length > 0 || currentVal.length > 0) {
      currentLine.push(currentVal.trim());
      if (currentLine.length > 1) {
          const r = mapRow(currentLine);
          if (r) rows.push(r);
      }
  }

  return rows;
}

function mapRow(cols: string[]): LocalRiddle | null {
    if (cols[0] === 'RiddleNumber') return null; // Header
    const id = parseInt(cols[0]);
    if (isNaN(id)) return null;

    return {
        id: id,
        set: cols[1],
        category: cols[2],
        difficulty_level: parseFloat(cols[3]),
        difficulty_label: cols[4],
        difficulty_text: cols[5],
        question_type: cols[6],
        poem: cols[7],
        answer: cols[8],
        primary_reference: 'Bible',
        secondary_references: []
    };
}

export const riddles = parseCSV(RAW_CSV);
