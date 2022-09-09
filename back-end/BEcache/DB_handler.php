<?php

include_once 'ignore/env.php';

/*
if(isset($_GET["OURAPIKEYSENT"]))
{
    if($_GET["OURAPIKEYSENT"]!=$_POST["OURAPIKEY"])
    {
        echo "You have no permission to use this API";
        exit();
    }
}
else
{
    echo "You have no permission to use this API";
    exit();
}
*/
class NFT
{
    private $id,$tokenId,$lastRefreshed,$price,$used,$forSale,$owner,$provider,$embassador,$tokenUri,$choose,$dirty;


    public function set_id($var)
    {
        $this->id=$var;
    }

    public function set_tokenId($var)
    {
        $this->tokenId=$var;
    }

    public function set_lastRefreshed($var)
    {
        $this->lastRefreshed=$var;
    }

    public function set_price($var)
    {
        $this->price=$var;
    }

    public function set_used($var)
    {
        $this->used=$var;
    }

    public function set_forSale($var)
    {
        $this->forSale=$var;
    }

    public function set_owner($var)
    {
        $this->owner=$var;
    }

    public function set_provider($var)
    {
        $this->provider=$var;
    }

    public function set_embassador($var)
    {
        $this->embassador=$var;
    }

    public function set_tokenUri($var)
    {
        $this->tokenUri=$var;
    }

    public function set_choose($var)
    {
        $this->choose=$var;
    }

    public function set_dirty($var)
    {
        $this->dirty=$var;
    }



    public function get_dirty()
    {
        return($this->dirty);
    }

    public function get_choose()
    {
        return($this->choose);
    }

    public function get_tokenUri()
    {
        return($this->tokenUri);
    }

    public function get_embassador()
    {
        return($this->embassador);
    }

    public function get_provider()
    {
        return($this->provider);
    }

    public function get_owner()
    {
        return($this->owner);
    }

    public function get_forSale()
    {
        return($this->forSale);
    }

    public function get_used()
    {
        return($this->used);
    }

    public function get_price()
    {
        return($this->price);
    }

    public function get_lastRefreshed()
    {
        return($this->lastRefreshed);
    }

    public function get_tokenId()
    {
        return($this->tokenId);
    }

    public function get_id()
    {
        return($this->id);
    }

    public function __construct()
    {
        try
        {
            $this->base = new PDO('mysql:host=localhost; dbname='.$_POST["DatabaseName"].'',$_POST["UserbaseName"],$_POST["Password"]);
            $this->base->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->base->exec("SET CHARACTER SET utf8");
        }
        catch (Exception $e) 
        {
            echo 'Error: ',  $e->getMessage(), "\n";
        }
    }

    public function insert()
    {
        //$id,$tokenId,$lastRefreshed,$price,$used,$forSale,$owner,$provider,$embassador,$tokenUri,$choose,$dirty;
        $query="insert into NFT_Cache (tokenId, lastRefreshed, price, used, forSale, owner, provider, embassador, tokenUri, choose, dirty) values (?,?,?,?,?,?,?,?,?,?,?)";
        $resultado= $this->base->prepare($query);

        //$this->id=htmlentities(addslashes($this->id));
        $this->tokenId=htmlentities(addslashes($this->tokenId));
        $this->lastRefreshed=htmlentities(addslashes($this->lastRefreshed));
        $this->price=htmlentities(addslashes($this->price));
        $this->used=htmlentities(addslashes($this->used));
        $this->forSale=htmlentities(addslashes($this->forSale));
        $this->owner=htmlentities(addslashes($this->owner));
        $this->provider=htmlentities(addslashes($this->provider));
        $this->embassador=htmlentities(addslashes($this->embassador));
        $this->tokenUri=htmlentities(addslashes($this->tokenUri));
        $this->choose=htmlentities(addslashes($this->choose));
        $this->dirty=htmlentities(addslashes($this->dirty));

        $resultado->execute(array($this->tokenId, $this->lastRefreshed, $this->price, $this->used, $this->forSale, $this->owner, $this->provider, $this->embassador, $this->tokenUri, $this->choose, $this->dirty));
        $resultado ->closeCursor();
    }
    

    public function update($tokenId)
    {
        $query="update NFT_Cache set id=?,tokenId=?,lastRefreshed=?,price=?,used=?,forSale=?,owner=?,provider=?,embassador=?,tokenUri=?,choose=?,dirty=? where tokenId='$tokenId'";
        $resultado= $this->base->prepare($query);

        $this->id=htmlentities(addslashes($this->id));
        $this->tokenId=htmlentities(addslashes($this->tokenId));
        $this->lastRefreshed=htmlentities(addslashes($this->lastRefreshed));
        $this->price=htmlentities(addslashes($this->price));
        $this->used=htmlentities(addslashes($this->used));
        $this->forSale=htmlentities(addslashes($this->forSale));
        $this->owner=htmlentities(addslashes($this->owner));
        $this->provider=htmlentities(addslashes($this->provider));
        $this->embassador=htmlentities(addslashes($this->embassador));
        $this->tokenUri=htmlentities(addslashes($this->tokenUri));
        $this->choose=htmlentities(addslashes($this->choose));
        $this->dirty=htmlentities(addslashes($this->dirty));

        $resultado->execute(array($this->buys));
        $resultado ->closeCursor();
    }
    
    
    
    public function read($tokenId)
    {
        //SELECT * FROM `NFT_Cache` WHERE 1
        $query="select * from NFT_Cache where tokenId=:tokenId";
        $resultado= $this->base->prepare($query);
        $tokenId=htmlentities(addslashes($tokenId));
        $resultado->BindValue(":tokenId",$tokenId);
        $resultado->execute();
        $fila=$resultado->fetchAll(PDO::FETCH_ASSOC);
        $resultado ->closeCursor();
    
        if (!empty($fila[0])) // si fila no esta vacia carga estos valores
        {
            $this->id=$fila[0]['id'];
            $this->tokenId=$fila[0]['tokenId'];
            $this->lastRefreshed=$fila[0]['lastRefreshed'];
            $this->price=$fila[0]['price'];
            $this->used=$fila[0]['used'];
            $this->forSale=$fila[0]['forSale'];       
            $this->owner=$fila[0]['owner'];
            $this->provider=$fila[0]['provider'];
            $this->embassador=$fila[0]['embassador'];
            $this->tokenUri=$fila[0]['tokenUri'];
            $this->choose=$fila[0]['choose'];
            $this->dirty=$fila[0]['dirty'];
        }
        else        // si el usuario no esta devuelve todo en 0
        {
            $this->id=0;//['id'];
            $this->tokenId=0;//['tokenId'];
            $this->lastRefreshed=0;//['lastRefreshed'];
            $this->price=0;//['price'];
            $this->used=0;//['used'];
            $this->forSale=0;//['forSale'];       
            $this->owner=0;//['owner'];
            $this->provider=0;//['provider'];
            $this->embassador=0;//['embassador'];
            $this->tokenUri=0;//['tokenUri'];
            $this->choose=0;//['choose'];
            $this->dirty=0;//['dirty'];
        }
        return ($fila[0]);

    }


    public function readOwner($owner)
    {
        //SELECT * FROM `NFT_Cache` WHERE 1
        $query="select * from NFT_Cache where owner=:owner";
        $resultado= $this->base->prepare($query);
        $owner=htmlentities(addslashes($owner));
        $resultado->BindValue(":owner",$owner);
        $resultado->execute();
        $fila=$resultado->fetchAll(PDO::FETCH_ASSOC);
        $resultado ->closeCursor();

    
        if (!empty($fila[0])) // si fila no esta vacia carga estos valores
        {
            $this->id=$fila[0]['id'];
            $this->tokenId=$fila[0]['tokenId'];
            $this->lastRefreshed=$fila[0]['lastRefreshed'];
            $this->price=$fila[0]['price'];
            $this->used=$fila[0]['used'];
            $this->forSale=$fila[0]['forSale'];       
            $this->owner=$fila[0]['owner'];
            $this->provider=$fila[0]['provider'];
            $this->embassador=$fila[0]['embassador'];
            $this->tokenUri=$fila[0]['tokenUri'];
            $this->choose=$fila[0]['choose'];
            $this->dirty=$fila[0]['dirty'];
        }
        else        // si el usuario no esta devuelve todo en 0
        {
            $this->id=0;//['id'];
            $this->tokenId=0;//['tokenId'];
            $this->lastRefreshed=0;//['lastRefreshed'];
            $this->price=0;//['price'];
            $this->used=0;//['used'];
            $this->forSale=0;//['forSale'];       
            $this->owner=0;//['owner'];
            $this->provider=0;//['provider'];
            $this->embassador=0;//['embassador'];
            $this->tokenUri=0;//['tokenUri'];
            $this->choose=0;//['choose'];
            $this->dirty=0;//['dirty'];
        }
        return ($fila);

    }


    public function readProvider($provider)
    {
        //SELECT * FROM `NFT_Cache` WHERE 1
        $query="select * from NFT_Cache where provider=:provider";
        $resultado= $this->base->prepare($query);
        $provider=htmlentities(addslashes($provider));
        $resultado->BindValue(":provider",$provider);
        $resultado->execute();
        $fila=$resultado->fetchAll(PDO::FETCH_ASSOC);
        $resultado ->closeCursor();

    
        if (!empty($fila[0])) // si fila no esta vacia carga estos valores
        {
            $this->id=$fila[0]['id'];
            $this->tokenId=$fila[0]['tokenId'];
            $this->lastRefreshed=$fila[0]['lastRefreshed'];
            $this->price=$fila[0]['price'];
            $this->used=$fila[0]['used'];
            $this->forSale=$fila[0]['forSale'];       
            $this->owner=$fila[0]['owner'];
            $this->provider=$fila[0]['provider'];
            $this->embassador=$fila[0]['embassador'];
            $this->tokenUri=$fila[0]['tokenUri'];
            $this->choose=$fila[0]['choose'];
            $this->dirty=$fila[0]['dirty'];
        }
        else        // si el usuario no esta devuelve todo en 0
        {
            $this->id=0;//['id'];
            $this->tokenId=0;//['tokenId'];
            $this->lastRefreshed=0;//['lastRefreshed'];
            $this->price=0;//['price'];
            $this->used=0;//['used'];
            $this->forSale=0;//['forSale'];       
            $this->owner=0;//['owner'];
            $this->provider=0;//['provider'];
            $this->embassador=0;//['embassador'];
            $this->tokenUri=0;//['tokenUri'];
            $this->choose=0;//['choose'];
            $this->dirty=0;//['dirty'];
        }
        return ($fila);

    }



    /*!
    * \brief    read_chooser() metodo que lee los datos de la BBDD.
    * \details  Busca en la BBDD la fila que tiene el menor chooser.
    * \return   $fila   array asociativo conteniendo la fila encontrada. Cada columna esta guardada en $fila[variable] donde
    *                   variable será las variables de este handler que se quiere buscar en la tabla. solo devuelve la primer fila 
    *                   encontrada con el chooser de menor valor.
    */   
    public function read_choose()
    {
        $query="SELECT * FROM ` NFT_Cache` where `choose`  =  (SELECT MIN(`choose`) FROM  `NFT_Cache`)"; // and dirty=1
        $resultado= $this->base->prepare($query);
        $resultado->execute();
        $fila=$resultado->fetch(PDO::FETCH_ASSOC);
        $resultado ->closeCursor();

        if (!empty($fila[0])) // si fila no esta vacia carga estos valores
        {
            $this->id=$fila[0]['id'];
            $this->tokenId=$fila[0]['tokenId'];
            $this->lastRefreshed=$fila[0]['lastRefreshed'];
            $this->price=$fila[0]['price'];
            $this->used=$fila[0]['used'];
            $this->forSale=$fila[0]['forSale'];       
            $this->owner=$fila[0]['owner'];
            $this->provider=$fila[0]['provider'];
            $this->embassador=$fila[0]['embassador'];
            $this->tokenUri=$fila[0]['tokenUri'];
            $this->choose=$fila[0]['choose'];
            $this->dirty=$fila[0]['dirty'];
        }
        else        // si el usuario no esta devuelve todo en 0
        {
            $this->id=0;//['id'];
            $this->tokenId=0;//['tokenId'];
            $this->lastRefreshed=0;//['lastRefreshed'];
            $this->price=0;//['price'];
            $this->used=0;//['used'];
            $this->forSale=0;//['forSale'];       
            $this->owner=0;//['owner'];
            $this->provider=0;//['provider'];
            $this->embassador=0;//['embassador'];
            $this->tokenUri=0;//['tokenUri'];
            $this->choose=0;//['choose'];
            $this->dirty=0;//['dirty'];
        }

        return($fila);
    }





    public function read_tokenId()
    {
        $query="SELECT * FROM `NFT_Cache` where `tokenId`  =  (SELECT MAX(`tokenId`) FROM  `NFT_Cache`)"; // and dirty=1
        $resultado= $this->base->prepare($query);
        $resultado->execute();
        $fila=$resultado->fetch(PDO::FETCH_ASSOC);
        $resultado ->closeCursor();

        if (!empty($fila[0])) // si fila no esta vacia carga estos valores
        {
            $this->id=$fila[0]['id'];
            $this->tokenId=$fila[0]['tokenId'];
            $this->lastRefreshed=$fila[0]['lastRefreshed'];
            $this->price=$fila[0]['price'];
            $this->used=$fila[0]['used'];
            $this->forSale=$fila[0]['forSale'];       
            $this->owner=$fila[0]['owner'];
            $this->provider=$fila[0]['provider'];
            $this->embassador=$fila[0]['embassador'];
            $this->tokenUri=$fila[0]['tokenUri'];
            $this->choose=$fila[0]['choose'];
            $this->dirty=$fila[0]['dirty'];
            echo "<br>El token maximo tenia tokenId= ".$this->tokenId;
        }
        else        // si el usuario no esta devuelve todo en 0
        {
            echo "<br>El token maximo estaba empty";
            $this->id=0;//['id'];
            $this->tokenId=0;//['tokenId'];
            $this->lastRefreshed=0;//['lastRefreshed'];
            $this->price=0;//['price'];
            $this->used=0;//['used'];
            $this->forSale=0;//['forSale'];       
            $this->owner=0;//['owner'];
            $this->provider=0;//['provider'];
            $this->embassador=0;//['embassador'];
            $this->tokenUri=0;//['tokenUri'];
            $this->choose=0;//['choose'];
            $this->dirty=0;//['dirty'];
        }
        print_r($fila);

        return($fila);
    }



}


?>