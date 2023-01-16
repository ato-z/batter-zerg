-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: batter
-- ------------------------------------------------------
-- Server version	5.7.26

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `az_config`
--

DROP TABLE IF EXISTS `az_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `az_config` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `des` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `type` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '0输入框 1switch切換 2文本域 3下拉菜单 4圖片上傳',
  `value` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `group` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `order` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '排序',
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `az_goods`
--

DROP TABLE IF EXISTS `az_goods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `az_goods` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL COMMENT '發起兌換的用戶id',
  `cate_id` int(10) unsigned NOT NULL,
  `title` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `cover` int(10) unsigned NOT NULL,
  `message` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '留言：期望交换意见',
  `type` tinyint(3) unsigned NOT NULL DEFAULT '1' COMMENT '期望交换方式 1兑换 2免费送',
  `content` text COLLATE utf8_unicode_ci COMMENT '内容',
  `tags` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '标签',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '发布状态 -1下架 0审核中 1发布 2交换中 3已完成',
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='商品表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `az_goods_cate`
--

DROP TABLE IF EXISTS `az_goods_cate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `az_goods_cate` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL COMMENT '唯一的name',
  `title` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '标题',
  `pic` int(10) unsigned NOT NULL COMMENT '图片',
  `pid` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '父分类， 0为顶级分类',
  `order` int(10) unsigned DEFAULT '0' COMMENT '排序， 值越大拍越前',
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `delete_date` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='商品分类表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `az_goods_like`
--

DROP TABLE IF EXISTS `az_goods_like`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `az_goods_like` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(10) unsigned NOT NULL,
  `goods_id` int(10) unsigned NOT NULL COMMENT '商品id',
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='商品点赞';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `az_goods_observe`
--

DROP TABLE IF EXISTS `az_goods_observe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `az_goods_observe` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `content` varchar(1024) COLLATE utf8_unicode_ci NOT NULL,
  `status` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '0审核中 1已发布',
  `uid` int(10) unsigned NOT NULL COMMENT '评论用户id',
  `from_id` int(10) unsigned DEFAULT NULL COMMENT '回复评论id，顶楼为空',
  `goods_id` int(10) unsigned NOT NULL COMMENT '商品id',
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='商品留言表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `az_goods_order`
--

DROP TABLE IF EXISTS `az_goods_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `az_goods_order` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `order_no` char(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '订单号',
  `from_uid` int(10) unsigned NOT NULL COMMENT '发起交换用户',
  `from_goods_id` int(10) unsigned NOT NULL,
  `from_address` text COLLATE utf8_unicode_ci NOT NULL COMMENT '发起交换者的交换方式快照',
  `to_uid` int(10) unsigned NOT NULL COMMENT '接受交换的用户',
  `to_goods_id` int(10) unsigned NOT NULL COMMENT '交换到的商品',
  `to_address` text COLLATE utf8_unicode_ci NOT NULL COMMENT '交换者的方式',
  `status` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '交换阶段 0发起订单 1双方统一意见 2交换成功 3交换失败',
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `delete_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `az_goods_order_un` (`order_no`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='交换商品订单';
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER createing
AFTER INSERT
ON az_goods_order FOR EACH ROW
Insert into az_goods_order_record(`order_id`, `action`, `create_date`) VALUES(new.id, new.status, now()) */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER updateing
AFTER update  
ON az_goods_order FOR EACH ROW
Insert into az_goods_order_record(`order_id`, `action`, `create_date`) VALUES(new.id, new.status, now()) */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `az_goods_order_record`
--

DROP TABLE IF EXISTS `az_goods_order_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `az_goods_order_record` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` int(10) unsigned NOT NULL,
  `action` tinyint(3) unsigned NOT NULL COMMENT '操作类型，对应订单的status',
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='订单操作记录';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `az_goods_tag`
--

DROP TABLE IF EXISTS `az_goods_tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `az_goods_tag` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `az_goods_tag_un` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='商品的分類標簽';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `az_image`
--

DROP TABLE IF EXISTS `az_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `az_image` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `path` varchar(1024) COLLATE utf8_unicode_ci NOT NULL COMMENT '文件保存路径',
  `width` int(10) unsigned NOT NULL COMMENT '图像宽度',
  `height` int(10) unsigned NOT NULL COMMENT '图像高度',
  `size` int(10) unsigned NOT NULL COMMENT '图像大小',
  `color` char(6) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '图片的均色色码，可用作图像懒加载',
  `from` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '图像来源 0本地 1对象存储服务器',
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=23 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='图片表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `az_menu`
--

DROP TABLE IF EXISTS `az_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `az_menu` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `path` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '如果存在二级菜单，path无效',
  `pid` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '父级菜单',
  `level` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '必须大于等于staff表中 level ',
  `icon` int(10) unsigned NOT NULL,
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete_date` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=20 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='后台菜单';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `az_menu_level`
--

DROP TABLE IF EXISTS `az_menu_level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `az_menu_level` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '路由名称',
  `level` tinyint(3) unsigned NOT NULL DEFAULT '8',
  `model` varchar(100) COLLATE utf8_unicode_ci NOT NULL COMMENT '模块名例如 staff',
  `get` tinyint(3) unsigned DEFAULT '0' COMMENT '访问权限',
  `put` tinyint(3) unsigned DEFAULT '0' COMMENT '更新权限',
  `delete` tinyint(3) unsigned DEFAULT '0' COMMENT '删除权限',
  `post` tinyint(3) unsigned DEFAULT '0' COMMENT '新增权限',
  `patch` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `all` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '所有',
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='权限控制';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `az_schools`
--

DROP TABLE IF EXISTS `az_schools`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `az_schools` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '学校名称',
  `latitude` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '纬度',
  `longitude` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '经度',
  `create_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `delete_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='学校列表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `az_staff`
--

DROP TABLE IF EXISTS `az_staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `az_staff` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL COMMENT '唯一的用户名，登录名',
  `nickname` varchar(100) COLLATE utf8_unicode_ci NOT NULL COMMENT '用户昵称',
  `cover` int(10) unsigned NOT NULL COMMENT '用户封面',
  `level` tinyint(4) unsigned DEFAULT '8' COMMENT '用户权限, 255为超级管理员. 其余程序定义...',
  `password` char(40) COLLATE utf8_unicode_ci NOT NULL COMMENT '用户密码，定长40字符',
  `status` tinyint(4) NOT NULL COMMENT '员工状态 0审核中 -1离职 1正常',
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `az_staff_un` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='员工表，管理员表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `az_staff_record`
--

DROP TABLE IF EXISTS `az_staff_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `az_staff_record` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `path` varchar(512) COLLATE utf8_unicode_ci DEFAULT NULL,
  `header` text COLLATE utf8_unicode_ci,
  `method` varchar(100) COLLATE utf8_unicode_ci NOT NULL COMMENT '请求方法',
  `staff_id` int(10) unsigned NOT NULL COMMENT '员工id',
  `create_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='管理员操作记录';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `az_staff_record_body`
--

DROP TABLE IF EXISTS `az_staff_record_body`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `az_staff_record_body` (
  `id` int(10) unsigned NOT NULL COMMENT '对应az_staff_record的id',
  `body` text COLLATE utf8_unicode_ci NOT NULL COMMENT 'body 携带的参数'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `az_user`
--

DROP TABLE IF EXISTS `az_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `az_user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `open_id` varchar(100) COLLATE utf8_unicode_ci NOT NULL COMMENT '微信小程序openid',
  `union_id` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '微信的唯一用户id，可能为空',
  `schools_id` int(10) unsigned DEFAULT NULL COMMENT '学校id',
  `nickname` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '昵称',
  `avatar` int(10) unsigned DEFAULT NULL COMMENT '头像id',
  `gender` tinyint(3) unsigned DEFAULT NULL COMMENT '微信用户的性别',
  `province` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '省',
  `city` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '市',
  `country` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '区',
  `mobile` char(11) COLLATE utf8_unicode_ci DEFAULT NULL,
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `az_user_address`
--

DROP TABLE IF EXISTS `az_user_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `az_user_address` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(10) unsigned NOT NULL,
  `nickname` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '昵称',
  `mobile` char(11) COLLATE utf8_unicode_ci NOT NULL COMMENT '手机号',
  `longitude` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '经度',
  `latitude` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '维度',
  `province` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '省',
  `city` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '市',
  `country` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '区',
  `detail` varchar(1024) COLLATE utf8_unicode_ci NOT NULL COMMENT '详情地址',
  `wechat` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '微信号',
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `delete_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'batter'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-01-16  9:35:27
