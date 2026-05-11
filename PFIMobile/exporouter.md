## 420 - KBC-LG : DÉVELOPPEMENT D’APPLICATION MOBILE- 2

##### Leçon 9 : Navigation et Expo Router

Lina Jabbour

1 **Hiver 2026**


### Sujets

#### A. Navigation

#### B. Expo-router

#### C. Créer un projet avec expo router

###### D. Stack et Tabs

###### E. Routes dynamiques et passage d'info

2


### NAVIGATION

###### Dans une application, la navigation c’est

######  Se repérer entre les différents écrans

###### Trouver comment aller vers un autre écran

###### C’est la gestion de la présentation et de la

###### transition entre plusieurs écrans.

3


### Expo Router vs React Navigation

 **React Navigation** est une bibliothèque qui permet

d'implémenter des fonctionnalités de navigation dans

une application React Native. C'est le standard

historique.

 **Expo Router** est la nouvelle façon de faire de la

navigation avec Expo. Expo-router est batit sur React

Navigation et se sert du système de fichiers. Il est plus

simple et similaire au web.

4


### Expo Router vs React Navigation

En bref :

 **Expo Router** est idéal pour les débutants, les projets

Expo, une navigation rapide, et applications

Web/Mobile (Universal Apps).

 **React Navigation** est préférable pour les projets

personnalisés, les structures très complexes, ou hors de

l'écosystème _expo_.

5


### B-Les concepts de base d'expo router

1. Toutes les pages sont dans le dossier **app,** quisert exclusivement à définir les

routes de votre application.

2. Vous avez besoin des fichiers

**a. index** dans le dossier, la page qui ouvre par défaut.

**b. _layout.tsx (.js)** pour configurer la navigationà ce niveau.

3. Vous aurez la plupart du temps ces 2 fichiers dans chaque sous dossier de **app**.

Et le _layout à la racine,

directement sous **app** , est

toujours un **Stack** navigator.

https://docs.expo.dev/router/basics/core-concepts/

6


### Les concepts de base d'expo router

**4. _layout.tsx (.js)** configure l’ordre de la navigation Stackou Tab dans dossier.
5. (tabs) un sous-repertoire qui sert à afficher les tabs en bas de l’ecran;

entre parenthèses pour ne pas avoir à specifier _tabs_ dans l’adresse

6. (tabs)/index: écran par défaut/page principale/accueil
7. Les autres composants doivent être dans un répertoire de niveau

supérieur, comme **components** dans cet exemple.

 https://docs.expo.dev/router/basics/core-concepts/

7


#### Navigation

#### Tab

https://docs.expo.dev/router/basics/common-navigation-patterns/

8


_Tab_ : Dans _layout.tsx/js: 3 liens pour 3 pages en **bas** de l’écran avec des icônes

9

```
name contient le nom du
ficher sans l'extension
```

### C- Créer un projet expo router

On peut créer un projet **expo router** en utilisant entre autre une des suivants:

1 - npx create-expo-app@latest nomProjet :

Cré un exemple de app avec expo-router et un peu trop de code.

2 - npx create-expo-app@latest --template **tabs** nomProjet

Installe et configure des fichiers avec Expo Router et TypeScript activés

3 - npx create-expo-app@latest --template **blank** nomProjet

et après on installe les bilbliothèques dont nous avons besoin.

nom du projet: lettres (a-z, A-Z), chiffres (0-9) et trait d'union (-), _exemple: nav-blank_

https://docs.expo.dev/more/create-expo/

10


### 1 - Expo-router

```
npx create-expo-app@latest nomProjet
Cré un exemple de app avec expo-router et un peu trop de code.
```
https://docs.expo.dev/router/introduction/

11


### 2 - create-expo-app avec –template tabs

**>npx create-expo-app@latest –template tabs nomProjet**

tabs: Installe et configure des fichiers avec expo Router et TypeScript activés.

https://docs.expo.dev/more/create-expo/

12


# C-Créer un projet expo

# react avec template blank

à faire en classe avec le prof ☺

13


#### Créer un projet expo react blank (comme d’habitude :)

1. Créez un projet: npx create-expo-app@latest --template blank **nav-blank**
2. Dans le dossier du projet, faites les installations >npx expo install expo-router react-native-safe-
    area-context react-native-screens expo-linking expo-constants expo-status-bar
5. Supprimez App.js (on n’en a plus besoin)
6. Exécutez... cela ne fonctionnera pas ... pas encore ☺
 https://medium.com/@jwbrendan/an-implementation-of-expo-router-with-typescript-tab-navigators-and-stack-navigators-in-a-react-f0655d12d86b

14

```
3. Configurez le point d'entrée dans package.json:
"main": "expo-router/entry"
```
```
4. Dans app.json ajoutez:
"scheme": "nav-blank"
```

### Implémentez la navigation

```
Créez le dossier app et les fichiers _layout.js et index.js Code du _layout.js:
```
```
import { Stack } from 'expo-router'
export default function RootLayout ()
```
```
{
```
```
return <Stack/>
```
```
}
```
```
Il se peut que app et index
soient créés
automatiquement à la
premières exécutionaprès
la configuration pour expo
router
```
15


#### 16 Aller à une autre page Link

1

2


#### 17 Aller à une autre page Link

Par défaut, Link ne peut contenir que du texte. Vous pouvez utiliser Pressable ou d'autres composants

plus sophistiqués; pour activer la propriété onPress à l'intérieur d'un Link ajoutez la propriété **asChild**.

**push** est utilisé pour assurer un ajout à la pile

```
import { Link} from 'expo-router'
```
```
const HomePage = () => {
return (
<View >
<Text>Page d'Accueil</Text>
<Text> </Text>
<Link href="/page2" push>Aller à la page 2</Link>
```
```
<Link href="/page2" asChild>
<Pressable>
<Text>Page2 -Pressable</Text>
</Pressable>
</Link>
</View>
)
}
export default HomePage
```

### Aller à une autre page avec useRouter

**useRouter** est le hook utilisé pour naviger

```
router.navigate: ajoutera une nouvelle page sur la pile,
ou achemine à une route existante sur la pile.
```
**router.push** pour pousser explicitement une nouvelle page sur la pile, (comme **Link** )

**router.back** pour revenir à la page précédente

**router.replace** pour remplacer la page actuelle sur la pile.

```
https://docs.expo.dev/router/basics/navigation/
```
18

```
import { useRouter } from 'expo-router’;
```
```
export default function Home() {
const router = useRouter();
return <Button title="Aller à la page 2 BUTTON"
onPress= {()=>router.navigate('/page2')} />
```
```
}
```

### Navigation entre les pages

AvecExpo Router, vous faites référence aux pages via leur URL

et leur position relatif au répertoire app

```
<Button title="go to about page" onPress= {()=>router.navigate('/about')} />
```
```
https://docs.expo.dev/router/basics/navigation/
```
19


### routes relatives

URL relative: on peut aussi naviguer par rapport à la route courante,

commençant par

- **/** racine
- **./ ​​** (pour le répertoire courant)
- ou **../** (pour le répertoire parent)

✓ <Link href="./article">Aller à l'article</Link>

✓ router.navigate('./article');

Notez que **souvent il vaut mieux utiliser le chemin absolue:**

href="/produits/article" quand le chemin est app/produits/article

20


21


#### Exemple 2: Dossier (tabs):_layout.js et index.js

```
Dans app, créez le dossier (tabs) et les fichiers _layout.js et index.js avec le code:
___________________________________________________________________________________
// app/(tabs)/index.js
import { View, Text, Pressable } from "react-native"
import { Link, router } from 'expo-router'
const HomePage = () => {
return (<View>
<Text>Page d'Accueil</Text>
<Link href="/tab_1"> Aller au tab 1</Link>
<Pressable style={{backgroundColor:"green"}}
onPress={() => router.push('/tab_2')}>
<Text>Aller au tab 2</Text>
</Pressable>
</View>)
}
export default HomePage
_______________________________________________________________
// app/(tabs)/_layout.js
import { Tabs } from 'expo-router'
const TabsLayout = () => {
return (<Tabs>
<Tabs.Screen name="index" options={{headerTitle: "Accueil ", title: "Tab Accueil"}} />
<Tabs.Screen name="tab_1/index" options={{headerTitle: "Tab 1", title: "Tab 1" }} />
<Tabs.Screen name="tab_2/index" options={{ headerTitle: "Tab 2", title: "Tab 2"}}/>
</Tabs>)
}
export default TabsLayout
```
22


#### La structure de vos dossiers et fichiers index:js

```
// app/(tabs)/tab_1/index.js
import { Text } from 'react-native'
```
```
const index = () => {
return (
<Text>Tab 1: Autobus</Text>
)
}
export default index
°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°
// app/(tabs)/tab_2/index.js
import { Text } from 'react-native'
```
```
const index = () => {
return (
<Text>Tab 2: Avion</Text>
)
}
export default index
```
Dans (tabs), créez les dossiers tab_1 et tab_2, fichiers **index.js** avec le code:

23


24


### 25 Les icônes: https://icons.expo.fyi/Index


(^26) Les icônes: https://icons.expo.fyi/Index


(^27) options: tabBarIcon, pour l’icône


### Après quelques modifications

28


(^29) Stack exemple 2


### Reload avec expo router

Il vaut mieux **redémarrer expo** sur votre cellulaire/emulateur

et refaire **npm start** quand vous modifiez la navigation avec

expo router pour être sur que les modifications ont été

appliquées

30


### D-expo router: Stack et Tabs

```
 Stack : navigation en pile; où la navigation vers un nouvel itinéraire pousse un
écran sur une pile, et le retrait de cet itinéraire le fait sortir de la pile.
```
 **Tabs** : navigation entre les écrans, en bas de l’écran.

31

import{ Stack } from'expo-router'

```
constStackLayout = () =>{
return<Stack>
<StackinitialRouteName="busIntro"/>
</Stack>
}
```
exportdefaultStackLayout

```
import{ Tabs } from'expo-router'
```
```
constTabsLayout = () =>{
return(
<Tabs>
<Tabs.Screenname="index"options={{headerTitle: "Accueil ", title: "accueil"}} />
<Tabs.Screenname="bus"options={{headerTitle: "Autobus", title: "bus"}}/>
<Tabs.Screenname="avion/index"options={{ headerTitle: "Avion", title: "avion"}} />
</Tabs>)
}
```
```
exportdefaultTabsLayout
```

### Tabs.Screen, options

```
<Tabs>
<Tabs.Screen name="tab_2/index"
options={{headerTitle: "Avion", title: "avion",
tabBarIcon:({color}) => <Ionicons name="airplane"
size={ 28 } color={color} /> }}/>
....
</Tabs>
```
**name** : nom du fichier, et nom du tab si title est absent.

```
options:
 headerTitle : l'entête de la page, si non caché
```
 **title** : titre sous le icône

```
 tabBarIcon :fonction qui renvoie un composant
(généralement une icône) à afficher.
```
32


### Tabs options

```
return (
<Tabs screenOptions={{tabBarActiveTintColor: "pink"}}>
<Tabs.Screen name="index" options={{headerTitle: "Accueil ", title: "accueil",
tabBarIcon: ({color}) => <Ionicons size={ 28 } name="home" color={color} /> }}
/>
<Tabs.Screen name="bus" options={{headerTitle: "Autobus", title: "bus",
tabBarIcon: ({color}) => <Ionicons size={ 28 } name="bus" color={color} /> }}
/>
<Tabs.Screen name="avion/index" options={{ headerTitle: "Avion", title: "avion",
tabBarIcon: ({color}) => <Ionicons size={ 28 } name="airplane" color={color} /> }}
/>
</Tabs>
)
```
```
___________________________________________________________________
```
**screenOptions** va effecter tous les Tabs

33


(^34) E- Passage d'information


#### E- Routes dynamiques et passage d'info

Les routes dynamiques et la possibilité de passer un objet params.

Considérez la structure de fichier suivante; chacun de ces liens mènera à la même page :

35

```
//app/index.tsx
import { Link, router } from 'expo-router';
import { View, Pressable } from 'react-native’;
export default function Page() {
return (
<View>
<Link href="/user/jean"> 1 - Afficher utilisateur jean </Link>
<Link
href={{ pathname: '/user/[id]',params: { id: 'jean' }}}>
2 - Afficher utilisateur jean
</Link>
<Pressable onPress={() => router.navigate({pathname:'/user',
params:{ id: 'jean' } })}>
<Text> 3 - Afficher utilisateur jean</Text>
</Pressable>
</View>
);
Navigating between pages -Expo }
Documentation
```

